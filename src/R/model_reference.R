library(PBSddesolve)
library(escape2024)
library(jsonlite)

tryCatch({
  # negative binomial network model
  print("Starting simulation 0...", stdout())
  flush.console()
  size = `${dispersion}`
  prob = size / (size + `${mu}`)

  print("Starting simulation 1...", stdout())
  flush.console()
  degree_nb = list(degree_distribution = "negative_binomial", size = size, prob = prob)
  c_degree_nb = mean_excess_degree(degree_nb)

  print("Starting simulation 2...", stdout())
  flush.console()

  if (c_degree_nb - `${reproduction_number}` < 0) {
    print("Invalid parameters: c_degree_nb must be greater than reproduction_number", stderr())
    print("Invalid parameters: c_degree_nb must be greater than reproduction_number", stdout())
    flush.console()
    stop("Invalid parameters: c_degree_nb must be greater than reproduction_number")
  }


  print("Starting simulation 3...", stdout())
  flush.console()
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

  print("Starting simulation 4...", stdout())
  flush.console()
  #poisson network model
  lambda = `${mu}`

  degree_poisson = list(degree_distribution = "poisson", lambda = lambda)
  c_degree_poisson = mean_excess_degree(degree_poisson)

  print("Starting simulation 5...", stdout())
  flush.console()
  if (c_degree_poisson - `${reproduction_number}` < 0) {
    print("Invalid parameters: c_degree_poisson must be greater than reproduction_number", stderr())
    print("Invalid parameters: c_degree_poisson must be greater than reproduction_number", stdout())
    flush.console()
    stop("Invalid parameters: c_degree_poisson must be greater than reproduction_number")
  }

  print("Starting simulation 6...", stdout())
  flush.console()
  infectiousness_rate_poisson = 2 / `${serial_interval}`
  recovery_rate_poisson = 2 / `${serial_interval}`
  transmission_rate_poisson = `${reproduction_number}` * recovery_rate_poisson / (c_degree_poisson - `${reproduction_number}`)

  print("Starting simulation 7...", stdout())
  flush.console()
  params_p <- c(list(
    transmission_rate = transmission_rate_poisson,
    infectiousness_rate = infectiousness_rate_poisson,
    recovery_rate = recovery_rate_poisson,
    population_size = `${population_size}`,
    seed_infected = `${seed_infected}`
  ), degree_poisson)

  print("Starting simulation 8...", stdout())
  flush.console()
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

  print("Starting simulation 9...", stdout())
  flush.console()
  models_combined(simulation_id = "`${simulation_id}`", time_end = `${time_end}`, increment = `${increment}`, params_p, params_nb, params_reference)

  print("Starting simulation 10...", stdout())
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