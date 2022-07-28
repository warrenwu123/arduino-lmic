# Notes on Class C implementation

These are working notes for Class C implementation, not really permanent documentation.

- [x] Sketch class C changes in `LMIC-FSM.cdd` / `LMIC-FSM.pdf`
- [x] Add the details on class C reception (channel use & spreading factor) to all the regional files. **_Not required; the class C parameters are the same as RX2._**
- [x] make this modular (so that we don't make tiny devices carry the extra code footprint)
- [x] add code for enabling / disabling class C mode (I think maybe there's a required uplink to announce that you're in class C)
  - [x] define in header file
  - [x] write code - when class C is enabled, need to set a flag and re-evaluate the FSM; in other words, if someone turns on class C while the LMIC is busy, we need to synchronize things. Ditto, I think, for turning things off.
- [x] distinguish class C reception from Class A or Class B.
- [x] change os_radio() to facilitate stopping ongoing Class C reception for Class A.
- [x] add code for processing class C downlinks
- [x] add API for starting a class C reception
- [x] add the code to the various states to start class C reception.

## Decisions

- Further parameterize radio driver so it gets most of its parameters via LMIC.radio.
- We often will say "RX2 channel is open" to mean that the radio is (supposed to be) receiving on the RX2 channel.
- Define "RX2 Window" to be the *time window* for a class A RX2 Window. The spec uses this also to mean "the RX2 channel is receiving" but we need to keep this straight.
- `LMIC_ENABLE_class_c` if non-zero enables the class C code.

## Open Questions

- [ ] how does the device distinguish (if at all) between a class C downlink received during the RX2 window, and a class A downlink? Does it simply assume that the network does the right thing?
- [ ] do we need to tell the rx frame processor whether a message was received during the RX2 window? Or can we let the network sort this out? For now, we arrange to be able to tell the rx frame processor, but we'll assume the network will sort things out.

## Building with arduino-cli for class C

arduino-cli compile -b "mcci:stm32:mcci_catena_4612:upload_method=STLink_bl,xserial=usb,sysclk=pll32m,boot=trusted,opt=osstd,lorawan_region=us915,lorawan_network=generic,lorawan_subband=sb0" --build-path /c/tmp/build-4612-class-c examples/compliance-otaa-halconfig/compliance-otaa-halconfig.ino