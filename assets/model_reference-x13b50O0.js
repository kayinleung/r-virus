const e=`library(PBSddesolve)
library(escape2024)
library(parallel)

tryCatch({
  parallel_models <- function(model) {
    if (model == "model_reference") {
      infectiousness_rate = 2 / \`\${serial_interval}\`
      recovery_rate = 2 / \`\${serial_interval}\`
      transmission_rate = \`\${reproduction_number}\` * recovery_rate
      model_reference(
        simulation_id = "\`\${simulation_id}\`",
        transmission_rate = transmission_rate,
        infectiousness_rate = infectiousness_rate,
        recovery_rate = recovery_rate,
        time_end = \`\${time_end}\`,
        increment = \`\${increment}\`,
        population_size = \`\${population_size}\`,
        seed_infected = \`\${seed_infected}\`
      )
      flush.console()
    } else if (model == "model_network_poisson") {
      lambda = \`\${mu}\`

      degree = list(degree_distribution = "poisson", lambda = lambda)
      var = var_degree(degree)
      avg = mean_degree(degree)
      c_degree = (var + avg^2 - avg) / avg

      stopifnot(c_degree - \`\${reproduction_number}\` > 0)

      infectiousness_rate = 2 / \`\${serial_interval}\`
      recovery_rate = 2 / \`\${serial_interval}\`
      transmission_rate = \`\${reproduction_number}\` * recovery_rate / (c_degree - \`\${reproduction_number}\`)

      model_network(
        simulation_id = "\`\${simulation_id}\`",
        transmission_rate = transmission_rate,
        infectiousness_rate = infectiousness_rate,
        recovery_rate = recovery_rate,
        time_end = \`\${time_end}\`,
        increment = \`\${increment}\`,
        population_size = \`\${population_size}\`,
        seed_infected = \`\${seed_infected}\`,
        degree_distribution = "poisson",
        infection = "SEIR",
        lambda = lambda
      )
      flush.console()
    } else {
    size = 1 / \`\${dispersion}\`
    prob = size / (size + \`\${mu}\`)

    degree = list(degree_distribution = "negative_binomial", size = size, prob = prob)
    var = var_degree(degree)
    avg = mean_degree(degree)
    c_degree = (var + avg^2 - avg) / avg

    stopifnot(c_degree - \`\${reproduction_number}\` > 0)


    infectiousness_rate = 2 / \`\${serial_interval}\`
    recovery_rate = 2 / \`\${serial_interval}\`
    transmission_rate = \`\${reproduction_number}\` * recovery_rate / (c_degree - \`\${reproduction_number}\`)

    model_network(
      simulation_id = "\`\${simulation_id}\`",
      transmission_rate = transmission_rate,
      infectiousness_rate = infectiousness_rate,
      recovery_rate = recovery_rate,
      time_end = \`\${time_end}\`,
      increment = \`\${increment}\`,
      population_size = \`\${population_size}\`,
      seed_infected = \`\${seed_infected}\`,
      degree_distribution = "negative_binomial",
      infection = "SEIR",
      size = size,
      prob = prob
    )
    flush.console()
    }
    }


  output <- mclapply(c("model_reference", "model_network_poisson", "model_network_negative_binomial"),
          FUN = parallel_models,
          mc.cores = 3)

}, error = function(e) {
  print(jsonlite::toJSON(
    list(error = list(simulation_id = "\`\${simulation_id}\`"), 
         message = e), 
    auto_unbox = TRUE, 
    pretty = FALSE
  ), stderr())
}, finally = {
  flush.console()
})`;export{e as default};
