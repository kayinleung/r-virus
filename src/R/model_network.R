library(PBSddesolve)
library(escape2024)

tryCatch({
  lambda = `${mu}`

  degree = list(degree_distribution = "poisson", lambda = lambda)
  var = var_degree(degree)
  avg = mean_degree(degree)
  c_degree = (var + avg^2 - avg) / avg

  stopifnot(c_degree - `${reproduction_number}` > 0)

  infectiousness_rate = 2 / `${serial_interval}`
  recovery_rate = 2 / `${serial_interval}`
  transmission_rate = `${reproduction_number}` * recovery_rate / (c_degree - `${reproduction_number}`)

  `${model_type}`(
    transmission_rate = transmission_rate,
    infectiousness_rate = infectiousness_rate,
    recovery_rate = recovery_rate,
    time_end = `${time_end}`,
    increment = `${increment}`,
    population_size = `${population_size}`,
    seed_infected = `${seed_infected}`,
    degree_distribution = "poisson",
    infection = "SEIR",
    lambda = lambda
  )
  flush.console()
}, finally = {
  flush.console()
})