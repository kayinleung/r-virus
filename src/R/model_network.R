library(PBSddesolve)
library(escape2024)

tryCatch({
  `${model_type}`(
    transmission_rate = `${transmission_rate}`,
    infectiousness_rate = `${infectiousness_rate}`,
    recovery_rate = `${recovery_rate}`,
    time_end = `${time_end}`,
    increment = `${increment}`,
    population_size = `${population_size}`,
    seed_infected = `${seed_infected}`,
    degree_distribution = "poisson",
    infection = "SEIR",
    lambda = 1
  )
  flush.console()
}, finally = {
  flush.console()
})