library(PBSddesolve)
library(escape2024)

print("Calling model_reference...")

result = tryCatch({
  data <- model_reference(
    transmission_rate = 0.25,
    infectiousness_rate = 0.3,
    recovery_rate = 0.2,
    time_end = 5, # 200,
    population_size = 1000,
    seed_infected = 5,
    increment = 1
  )
  print(data)
  flush.console()
  # return(data)
}, warning = function(w) {
  print("Warning...")
  print(w)
}, error = function(e) {
  print("Error...")
  print(e)
}, finally = {
  print("All done!")
  flush.console()
})

# json_output <- jsonlite::toJSON(data, pretty = TRUE)