library(PBSddesolve)
library(escape2024)

print("Calling model_reference...")

result = tryCatch({
  data <- model_reference(
    transmission_rate = 0.25,
    infectiousness_rate = 0.25,
    recovery_rate = 0.2,
    time_end = 400,
    increment = 1,
    population_size = `${population_size}`,
    seed_infected = 1E-3
  )
  print(data)
  flush.console()
}, warning = function(w) {
  print("Warning...")
  print(w)
}, error = function(e) {
  print("Error...")
  print(e)
}, finally = {
  flush.console()
})

# json_output <- jsonlite::toJSON(data, pretty = TRUE)