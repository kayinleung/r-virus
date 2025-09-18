library(PBSddesolve)
library(escape2024)
library(jsonlite)

tryCatch({
  # negative binomial network model
  size = `${dispersion}`
  prob = size / (size + `${mu}`)

  degree_nb = list(degree_distribution = "negative_binomial", size = size, prob = prob)
  c_degree_nb = mean_excess_degree(degree_nb)

  if (c_degree_nb - `${reproduction_number}` <= 0) {
    message("Invalid parameters: c_degree_nb must be greater than reproduction_number")
  }

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

  if (c_degree_poisson - `${reproduction_number}` <= 0) {
    message("Invalid parameters: c_degree_poisson must be greater than reproduction_number")
  }

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

  # calculate theoretical final size
  final_size_reference <- theory_reference_final_size(r_0 = `${reproduction_number}`)

  # simulate
  time_end <- ceiling(6 * `${serial_interval}`)
  combined_states <- models_combined(time_end, increment = `${increment}`, params_p, params_nb, params_reference)
  
  # initial value for the next steps
  current_state_network_p <- combined_states$network_poisson
  current_state_network_nb <- combined_states$network_nb
  current_state_reference <- combined_states$reference

  for (i in 7:20) {
    # check if final size is already reached
    if (final_size_reference - current_state_reference["R"] / `${population_size}` > 1E-4) {
      # determine the next time steps
      time_interval <- seq(time_end + `${increment}`, time_end + `${serial_interval}`, by = `${increment}`)
        for (t in time_interval) {
          current_state_network_p <- simulate_outbreak_seir_network(
            t, `${increment}`, current_state_network_p, params_p, "IN_PROGRESS"
            )
          current_state_network_nb <- simulate_outbreak_seir_network(
            t, `${increment}`, current_state_network_nb, params_nb, "IN_PROGRESS"
            )
          current_state_reference <- simulate_outbreak_seir_reference(
            t, `${increment}`, current_state_reference, params_reference, "IN_PROGRESS"
            )$current
      }
      time_end <- time_interval[length(time_interval)]
    }
  }

  # simulation status COMPLETED
  current_state_network_p <- simulate_outbreak_seir_network(
    time_end + `${increment}`, `${increment}`, current_state_network_p, params_p, "COMPLETED"
    )
  current_state_network_nb <- simulate_outbreak_seir_network(
    time_end + `${increment}`, `${increment}`, current_state_network_nb, params_nb, "COMPLETED"
    )
  current_state_reference <- simulate_outbreak_seir_reference(
    time_end + `${increment}`, `${increment}`, current_state_reference, params_reference, "COMPLETED"
    )$current

}, error = function(e) {
  print(jsonlite::toJSON(
    list(message = conditionMessage(e)), 
    auto_unbox = TRUE, 
    pretty = FALSE
  ), stderr())
}, finally = {
  flush.console()
})