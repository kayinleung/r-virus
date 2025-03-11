import { WebR } from 'webr';
import { useEffect, useState } from 'react';
import type { RDouble } from 'webr';

export const WebRComponent = () => {
  const [webR, setWebR] = useState<WebR|null>(null);

  useEffect(() => {
    const setupR = async () => {
      const r = new WebR();
      await r.init();
      setWebR(r);
    };
    console.log('WebR - useEffect calling setupR...');
    setupR();
  }, []);

  useEffect(() => {
    if(!webR) return;

    const compute = async () => {
      const result = await webR.evalR('rnorm(10,5,1)') as RDouble;
      const output = await result.toArray();

      console.log('WebRComponent - result, output=', result, output);
    };
    compute();
  }, [webR]);

  if(!webR) {
    return <div>Loading...</div>;
  };

  return (
    <div>
      <h2>WebR Component</h2>
    </div>
  );
};
