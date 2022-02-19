# Notes on Class C implementation

These are working notes for Class C implementation, not really permanent documentation.

- [x] Sketch class C changes in `LMIC-FSM.cdd` / `LMIC-FSM.pdf`
- [x] Add the details on class C reception (channel use & spreading factor) to all the regional files. **_Not required; the class C parameters are the same as RX2._**
- [x] make this modular (so that we don't make tiny devices carry the extra code footprint)
- [x] add code for enabling / disabling class C mode (I think maybe there's a required uplink to announce that you're in class C)
  - [x] define in header file
  - [ ] write code - when class C is enabled, need to set a flag and re-evaluate the FSM; in other words, if someone turns on class C while the LMIC is busy, we need to synchronize things. Ditto, I think, for turning things off.
- [ ] modify the radio driver to look for the class C flag on entry and stop reception without crashing.
- [ ] add api for stopping an ongoing reception (for switching from RX2 to TX or RX1)
- [ ] add code for processing class C downlinks
- [ ] add api for starting a class C reception (rework the RX2 start-reception api from class A?)
- [ ] add the code to the various states to start class C reception.

## Decisions

- Define "RX2 channel" to mean the channel, bandwidth and spreading factor used for class A RX2 downlinks, and for Class C downlinks.
- We often will say "RX2 channel is open" to mean that the radio is (supposed to be) receiving on the RX2 channel.
- Define "RX2 Window" to be the *time window* for a class A RX2 Window. The spec uses this also to mean "the RX2 channel is receiving" but we need to keep this straight.
- `LMIC_ENABLE_class_c` if non-zero enables the class C code.

## Open Questions

- [ ] how does the device distinguish (if at all) between a class C downlink received during the RX2 window, and a class A downlink? Does it simply assume that the network does the right thing?
- [ ] do we need to tell the rx frame processor whether a message was received during the RX2 window? Or can we let the network sort this out? For now, we arrange to be able to tell the rx frame processor, but we'll assume the network will sort things out.
