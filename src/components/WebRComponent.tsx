import { WebR } from 'webr';
import type { WebR as WebRType } from 'webr';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { computed, signal } from '@preact/signals-react';

const rCode = `
  mass_action_seir <- function(R_o, population_size, initial_exposed = 1, initial_infected = 1, time_steps = 1000, gamma = 1/14, sigma = 1/5) {
    # Input validation
    if (R_o < 0 || R_o > 20) {
      stop("R_o must be between 0 and 20.")
    }
    if (population_size <= 0) {
      stop("Population size must be positive.")
    }
    if (initial_exposed < 0 || initial_infected < 0) {
        stop("Initial exposed and infected must be non-negative")
    }
    
    # Initialize state variables (same as before)
    S <- population_size - initial_exposed - initial_infected
    E <- initial_exposed
    I <- initial_infected
    R <- 0

    # Initialize output list
    output_list <- list()

    # Simulation loop (same as before, but store in list)
    for (t in 1:time_steps) {
      beta <- R_o * gamma
      dS <- -beta * S * I / population_size
      dE <- beta * S * I / population_size - sigma * E
      dI <- sigma * E - gamma * I
      dR <- gamma * I

      S_new <- S + dS
      E_new <- E + dE
      I_new <- I + dI
      R_new <- R + dR

      new_cases <- I_new - I
      recovered <- R_new - R

      output_list[[t]] <- list(time = t, new_cases = new_cases, recovered = recovered)

      S <- S_new
      E <- E_new
      I <- I_new
      R <- R_new
    }

    # Convert list to JSON
    json_output <- jsonlite::toJSON(output_list, pretty = TRUE)
    cat(paste(json_output, collapse = NULL))
    flush.console()
  }

  R_o <- 2.5
  population_size <- 100
  mass_action_seir(R_o, population_size)
`;

type DataElement = {
  streamingId: string;
  time: number;
  new_cases: number;
  recovered: number;
};

type ParsedMessage = {
  streamingId: string;
  dataElement: DataElement;
  remainingString: string;
}

const extractJsonObject = (inputString: string): ParsedMessage | null => {
  const regex = /\{[^}]*\}/; // Matches { followed by any characters except }, until the first }
  const match = inputString.match(regex);

  if(!match) {
    return null; // No JSON object found
  }

  const jsonString = match[0];
  const startIndex = inputString.indexOf(jsonString);
  const endIndex = startIndex + jsonString.length;

  return {
    streamingId: uuidv4(),
    dataElement: JSON.parse(jsonString) as DataElement,
    remainingString: inputString.substring(endIndex),
  };
}

const dataSignal = signal<DataElement[]>([]);
const length = computed(() => dataSignal.value.length);

export const WebRComponent = () => {
  const [webR, setWebR] = useState<WebRType|null>(null);
  const [read, setRead] = useState<AsyncGenerator<DataElement, void, unknown>|null>(null);
  // const [outputList, setOutputList] = useState<DataElement[]>([]);
  // const [streamEvent, setStreamEvent] = useState<DataElement>();

  console.log('WebRComponent - dataSignal.value.length=', dataSignal.value.length);

  // setOutputList([...outputList, streamEvent] as DataElement[]);
  // console.log('WebRComponent - outputList=', outputList);

  useEffect(() => {
    const setupR = async () => {
      const r = new WebR({ baseUrl: 'https://webr.r-wasm.org/latest/' });

      await r.init();
      await r.installPackages(['jsonlite']);
      setWebR(r); 

      async function* read() {
        let buffer = "";
        for (;;) {
          const item = await r.read();
          if (item.type !== 'stdout') {
            continue;
          }
          buffer += item.data;
          const parseResult = extractJsonObject(buffer);
          if (!parseResult) {
            continue;
          }
          const { dataElement, remainingString } = parseResult;
          buffer = remainingString;
          yield {
            ...dataElement,
            streamingId: parseResult.streamingId,
          };

        }
      }
      setRead(read);
  
    };
    setupR();
  }, []);

  useEffect(() => {
    if (!webR) return;

    const compute = async () => {
      webR.writeConsole(rCode);
      for await (const item of read ?? []) {
        console.log('WebRComponent - item=', item);
        // dataSignal.value.push(item);
        dataSignal.value = [...dataSignal.value, item];
        console.log('WebRComponent - dataSignal.value=', dataSignal.value);
      }
    };

    compute();
  }, [webR, read]);

  if(!webR) {
    return <div>Loading...</div>;
  };

  return (
    <div>
      <h2>WebR Component: {length} elements</h2>
    </div>
  );
};
