library(PBSddesolve)
library(escape2024)
library(jsonlite)

tryCatch({
  # negative binomial network model
  size = `${dispersion}`
  prob = size / (size + `${mu}`)

  degree_nb = list(degree_distribution = "negative_binomial", size = size, prob = prob)
  c_degree_nb = mean_excess_degree(degree_nb)

  stopifnot(c_degree_nb - `${reproduction_number}` > 0)


  infectiousness_rate_nb = 2 / `${serial_interval}`
  recovery_rate_nb = 2 / `${serial_interval}`
  transmission_rate_nb = `${reproduction_number}` * recovery_rate_nb / (c_degree_nb - `${reproduction_number}`)

  params_nb <- c(
    list(
    transmission_rate = transmission_rate_nb,
    infectiousness_rate = infectiousness_rate_nb,
    recovery_rate = recovery_rate_nb,
    population_size = `${population_size}`,
    seed_infected = `${seed_infected}`
  ),
    degree_nb
  ) 

  #poisson network model
  lambda = `${mu}`

  degree_poisson = list(degree_distribution = "poisson", lambda = lambda)
  c_degree_poisson = mean_excess_degree(degree_poisson)

  stopifnot(c_degree_poisson - `${reproduction_number}` > 0)

  infectiousness_rate_poisson = 2 / `${serial_interval}`
  recovery_rate_poisson = 2 / `${serial_interval}`
  transmission_rate_poisson = `${reproduction_number}` * recovery_rate_poisson / (c_degree_poisson - `${reproduction_number}`)

  params_p <- c(list(
    transmission_rate = transmission_rate_poisson,
    infectiousness_rate = infectiousness_rate_poisson,
    recovery_rate = recovery_rate_poisson,
    population_size = `${population_size}`,
    seed_infected = `${seed_infected}`
  ), degree_poisson)

  # reference model
  infectiousness_rate_reference = 2 / `${serial_interval}`
  recovery_rate_reference = 2 / `${serial_interval}`
  transmission_rate_reference = `${reproduction_number}` * recovery_rate_reference
  params_reference <- list(
          transmission_rate = transmission_rate_reference,
          infectiousness_rate = infectiousness_rate_reference,
          recovery_rate = recovery_rate_reference,
          population_size = `${population_size}`,
          seed_infected = `${seed_infected}`
  )

  models_combined(simulation_id = "`${simulation_id}`", time_end = `${time_end}`, increment = `${increment}`, params_p, params_nb, params_reference)

  flush.console()
}, error = function(e) {
  print(jsonlite::toJSON(
    list(error = list(simulation_id = "`${simulation_id}`"), 
        message = conditionMessage(e)), 
    auto_unbox = TRUE, 
    pretty = FALSE
  ), stderr())
}, finally = {
  flush.console()
})