library(PBSddesolve)
library(escape2024)

tryCatch({
  model_reference(
    transmission_rate = 0.2,
    infectiousness_rate = 0.25,
    recovery_rate = 0.2,
    time_end = `${time_end}`,
    increment = 1,
    population_size = `${population_size}`,
    seed_infected = 1E-3
  )
  flush.console()
}, finally = {
  flush.console()
})