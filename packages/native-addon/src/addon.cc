#include <napi.h>
#include <uv.h>

#include <array>
#include <string>

namespace {

constexpr const char* DEFAULT_ALPHABET =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
constexpr size_t POOL_SIZE = 4096;

thread_local std::array<uint8_t, POOL_SIZE> randomPool;
thread_local size_t poolOffset = POOL_SIZE;

void FillSecureRandomOrThrow(Napi::Env env, uint8_t* buffer, size_t size) {
  const int status = uv_random(nullptr, nullptr, buffer, size, 0, nullptr);
  if (status != 0) {
    Napi::Error::New(env, "sigilid/native: secure random generation failed")
        .ThrowAsJavaScriptException();
  }
}

Napi::Value Noop(const Napi::CallbackInfo& info) {
  return info.Env().Undefined();
}

Napi::Value GenerateDefault(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() != 1 || !info[0].IsNumber()) {
    Napi::TypeError::New(env, "length must be a number").ThrowAsJavaScriptException();
    return env.Null();
  }

  const double lengthAsDouble = info[0].As<Napi::Number>().DoubleValue();
  const uint32_t lengthAsUint = info[0].As<Napi::Number>().Uint32Value();
  if (lengthAsDouble != static_cast<double>(lengthAsUint) || lengthAsUint < 1 ||
      lengthAsUint > 255) {
    Napi::RangeError::New(env, "length must be an integer between 1 and 255")
        .ThrowAsJavaScriptException();
    return env.Null();
  }

  const size_t length = static_cast<size_t>(lengthAsUint);
  std::string result(length, '\0');
  if (poolOffset + length > POOL_SIZE) {
    FillSecureRandomOrThrow(env, randomPool.data(), POOL_SIZE);
    if (env.IsExceptionPending()) {
      return env.Null();
    }
    poolOffset = 0;
  }

  const size_t end = poolOffset + length;
  size_t resultIndex = 0;
  while (poolOffset < end) {
    result[resultIndex++] = DEFAULT_ALPHABET[randomPool[poolOffset++] & 63];
  }

  return Napi::String::New(env, result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("generateDefault", Napi::Function::New(env, GenerateDefault));
  exports.Set("noop", Napi::Function::New(env, Noop));
  return exports;
}

}  // namespace

NODE_API_MODULE(sigilid_native, Init)
