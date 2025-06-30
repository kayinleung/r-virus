library(PBSddesolve)
library(escape2024)

tryCatch({
  infectiousness_rate = 2 / `${serial_interval}`
  recovery_rate = 2 / `${serial_interval}`
  transmission_rate =  `${reproduction_number}` / `${serial_interval}`

  `${model_type}`(
    simulation_id = "`${simulation_id}`",
    transmission_rate = transmission_rate,
    infectiousness_rate = infectiousness_rate,
    recovery_rate = recovery_rate,
    time_end = `${time_end}`,
    increment = `${increment}`,
    population_size = `${population_size}`,
    seed_infected = `${seed_infected}`
  )
  flush.console()
}, finally = {
  flush.console()
})