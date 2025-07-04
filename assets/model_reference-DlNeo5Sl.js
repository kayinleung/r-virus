const e=`library(PBSddesolve)
library(escape2024)

tryCatch({
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
}, error = function(e) {
  write(jsonlite::toJSON(
    list(error = list(simulation_id = "\`\${simulation_id}\`"), 
         message = e), 
    auto_unbox = TRUE, 
    pretty = FALSE
  ), stderr())
}, finally = {
  flush.console()
})`;export{e as default};
