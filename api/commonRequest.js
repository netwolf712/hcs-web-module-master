export function getRequestDTO(commandId, data) {
  const dto = {
    deviceType: 7,
    deviceId: null,
    parentNo: null,
    phoneNo: null,
    commandId: commandId,
    ipAddress: null,
    macAddress: null,
    data: data,
  };
  return dto;
}
