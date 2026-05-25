#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEBeacon.h>
#include "esp_bt.h"

#define BEACON_UUID "12345678-1234-1234-1234-123456789012"
#define MAJOR 1
#define MINOR 1

BLEAdvertising *pAdvertising;

void setup()
{
  Serial.begin(115200);
  
  delay(2000); // Đợi 2 giây để cổng Serial ổn định
  Serial.println("Starting BLE");

  BLEDevice::init("Museum Beacon 1");
  esp_ble_tx_power_set(ESP_BLE_PWR_TYPE_ADV, ESP_PWR_LVL_N12);

  BLEBeacon oBeacon = BLEBeacon();
  oBeacon.setManufacturerId(0x4C00);
  oBeacon.setProximityUUID(BLEUUID(BEACON_UUID));
  oBeacon.setMajor(MAJOR);
  oBeacon.setMinor(MINOR);
  oBeacon.setSignalPower(0xC5);

  BLEAdvertisementData oAdvertisementData = BLEAdvertisementData();
  oAdvertisementData.setFlags(0x04);
  
  std::string strServiceData = "";
  strServiceData += (char)26;
  strServiceData += (char)0xFF;
  strServiceData += oBeacon.getData();
  oAdvertisementData.addData(strServiceData);

  pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->setAdvertisementData(oAdvertisementData);

  // Đưa tên thiết bị vào gói Scan Response để nRF Connect hiển thị tên
  BLEAdvertisementData oScanResponseData = BLEAdvertisementData();
  oScanResponseData.setName("Museum Beacon 1");
  pAdvertising->setScanResponseData(oScanResponseData);
  pAdvertising->setScanResponse(true);

  pAdvertising->start();
  Serial.println("Advertising");
  
}

void loop()
{
  delay(2000);
}
