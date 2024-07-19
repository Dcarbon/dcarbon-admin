enum EIotDeviceStatus {
  NONE = -1,
  REJECT = 1,
  REGISTER = 5,
  SUCCESS = 10,
}

enum EIotDeviceType {
  NONE = 0,
  WIND_POWER = 10,
  SOLAR_POWER = 11,
  BURN_METHANE = 20,
  BURN_BIOMASS = 21,
  FERTILIZER = 30,
  BURN_TRASH = 31,
}

export { EIotDeviceStatus, EIotDeviceType };
