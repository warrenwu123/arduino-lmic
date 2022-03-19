//
// Decode the uplinks for the DHT22 sample apps
//
// Data format:
//	port number is 1.
//	bytes 0 and 1 of payload are the temperature
//	bytes 2 and 3 of payload are the humidity
//
//	Both are encoded as sflt16 values (see LMIC README).
//
// Original is at:
//  https://github.com/mcci-catena/arduino-lmic/ at extra/ttnv3-decoder-dht22.js
//

//
// Name: decodeUplink()
//
// Function:
//    The entry point:
//
// This function is called by TTNv3; TTNv3 looks for the name
// `decodeUplink()`.
//
// tInput is an object:
//    tInput.bytes has the data as a byte array,
//    tInput.fPort is the port number as a number.
//
// The function returns an object:
//    result.data is an object, containing the decoded data.
//    result.warnings is an array (possibly empty) of warning messages.
//    result.errors is an array (hopefully empty) of error messages.
//
function decodeUplink(tInput) {
  var bytes = tInput.bytes;
  var port = tInput.fPort;

  // validate the port number
  if (port !== 1)
    return { errors: [ "invalid port: " + port ] };

  // validate the length.
  if (bytes.length !== 4)
    return { errors: [ "invalid length: " + bytes.length ] };

  // convert the raw bytes into equivalent raw (encoded) integers
  var tRaw = (bytes[0] << 8) + bytes[1];
  var rhRaw = (bytes[2] << 8 ) + bytes[3];

  // decode the raw integers into unscaled floating point numbers
  var tFloatRaw = sflt162f(tRaw);
  var rhFloatRaw = sflt162f(rhRaw);

  // the sending program divided by 100 before encoding. so now
  // we must do the reverse to scale back to engineering units.
  var tFinal = tFloatRaw * 100;
  var rhFinal = rhFloatRaw * 100;

  // prepare the result
  var result = {
    data: {
      t:  tFinal, // something
      rh: rhFinal, // something else
    },
    warnings: [],
    errors: []
  };

  return result;
}

// decode an encoded 16-bit signed float.
function sflt162f(rawSflt16)
    {
    // rawSflt16 is the 2-byte number decoded from wherever;
    // it's in range 0..0xFFFF
    // bit 15 is the sign bit
    // bits 14..11 are the exponent
    // bits 10..0 are the the mantissa. Unlike IEEE format,
    // the msb is explicit; this means that numbers
    // might not be normalized, but makes coding for
    // underflow easier.
    // As with IEEE format, negative zero is possible, so
    // we special-case that in hopes that JavaScript will
    // also cooperate.
    //
    // The result is a number in the open interval (-1.0, 1.0);
    //

    // throw away high bits for repeatability.
    rawSflt16 &= 0xFFFF;

    // special case minus zero:
    if (rawSflt16 == 0x8000)
        return -0.0;

    // extract the sign.
    var sSign = ((rawSflt16 & 0x8000) !== 0) ? -1 : 1;

    // extract the exponent
    var exp1 = (rawSflt16 >> 11) & 0xF;

    // extract the "mantissa" (the fractional part)
    var mant1 = (rawSflt16 & 0x7FF) / 2048.0;

    // convert back to a floating point number. We hope
    // that Math.pow(2, k) is handled efficiently by
    // the JS interpreter! If this is time critical code,
    // you can replace by a suitable shift and divide.
    var f_unscaled = sSign * mant1 * Math.pow(2, exp1 - 15);

    return f_unscaled;
    }
