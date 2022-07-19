/*

Module:  getpinmap_catena5120.cpp

Function:
        Arduino-LMIC C++ HAL pinmaps for various boards

Copyright & License:
        See accompanying LICENSE file.

Author:
        Dhinesh Kumar Pitchai, MCCI       July 2022

*/

#if defined(ARDUINO_MCCI_CATENA_5120) || \
    /* legacy name */ \
    defined(ARDUINO_CATENA_5120)

#include <arduino_lmic_hal_boards.h>
#include <Arduino.h>

#include "../lmic/oslmic.h"

namespace Arduino_LMIC {

class HalConfiguration_Catena5120_t : public HalConfiguration_t
        {
public:
        enum DIGITAL_PINS : uint8_t
                {
                PIN_SX1276_NSS = D7,
                PIN_SX1276_NRESET = D8,
                PIN_SX1276_DIO0 = D25,
                PIN_SX1276_DIO1 = D26,
                PIN_SX1276_DIO2 = D27,
                PIN_SX1276_ANT_SWITCH_RX = HalPinmap_t::UNUSED_PIN,
                PIN_SX1276_ANT_SWITCH_TX_BOOST = HalPinmap_t::UNUSED_PIN,
                PIN_SX1276_ANT_SWITCH_TX_RFO = HalPinmap_t::UNUSED_PIN,
                PIN_VDD_BOOST_ENABLE = HalPinmap_t::UNUSED_PIN,
                };
        };

// save some typing by bringing the pin numbers into scope
static HalConfiguration_Catena5120_t myConfig;

static const HalPinmap_t myPinmap =
        {
        .nss = HalConfiguration_Catena5120_t::PIN_SX1276_NSS,      // chip select is D7
        .rxtx = HalConfiguration_Catena5120_t::PIN_SX1276_ANT_SWITCH_RX, // RXTX is D29
        .rst = HalConfiguration_Catena5120_t::PIN_SX1276_NRESET,   // NRESET is D8

        .dio = {HalConfiguration_Catena5120_t::PIN_SX1276_DIO0,    // DIO0 (IRQ) is D25
                HalConfiguration_Catena5120_t::PIN_SX1276_DIO1,    // DIO1 is D26
                HalConfiguration_Catena5120_t::PIN_SX1276_DIO2,    // DIO2 is D27
               },
        .rxtx_rx_active = 1,
        .rssi_cal = 10,
        .spi_freq = 8000000,     /* 8MHz */
        .pConfig = &myConfig
        };

const HalPinmap_t *GetPinmap_Catena5120(void)
        {
        return &myPinmap;
        }

}; // namespace Arduino_LMIC

#endif /* defined(ARDUINO_MCCI_CATENA_5120) || defined(ARDUINO_CATENA_5120) */
