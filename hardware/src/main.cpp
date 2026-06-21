#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>

void setup() {
  Serial.begin(115200);
  delay(3000); 
  Serial.println("Starting BLE...");
  BLEDevice::init("Museum Beacon 2");
  esp_ble_tx_power_set(ESP_BLE_PWR_TYPE_ADV, ESP_PWR_LVL_N12);

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  BLEAdvertisementData oAdvertisementData = BLEAdvertisementData();
  
  // Set cờ BLE (General Discoverable)
  oAdvertisementData.setFlags(0x06);

  // Tạo chuỗi cấu trúc iBeacon chuẩn (không dùng thư viện ngoài)
  std::string mfgData = "";
  mfgData += (char)0xE5;
  mfgData += (char)0x02;
  mfgData += (char)0x02; // iBeacon Type
  mfgData += (char)0x15; // Chiều dài data (21 bytes)
  
  // Gắn chính xác UUID: 12345678-1234-1234-1234-123456789012
  uint8_t uuid[16] = {0x12, 0x34, 0x56, 0x78, 0x12, 0x34, 0x12, 0x34, 0x12, 0x34, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12};
  for (int i=0; i<16; i++) {
    mfgData += (char)uuid[i];
  }
  
  // Major: 1 (2 bytes)
  mfgData += (char)0x00; 
  mfgData += (char)0x01;
  
  // Minor: 1 (2 bytes)
  mfgData += (char)0x00; 
  mfgData += (char)0x01;
  
  // TX Power: -59 dBm (0xB9)
  mfgData += (char)0xB9;

  // Đẩy data vào gói quảng bá
  oAdvertisementData.setManufacturerData(mfgData);
  pAdvertising->setAdvertisementData(oAdvertisementData);

  // Đẩy tên vào gói Scan Response để khỏi bị lấn chiếm 31 bytes
  BLEAdvertisementData oScanResponseData = BLEAdvertisementData();
  oScanResponseData.setName("Museum Beacon 2");
  pAdvertising->setScanResponseData(oScanResponseData);
  
  pAdvertising->start();
  Serial.println("Advertising Standard iBeacon!");
}

void loop() {
  delay(1000);
}