#include <napi.h>
#include <string>
#include <openssl/sha.h>

Napi::Value HashPassword(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1 || !info[0].IsString()) {
    Napi::TypeError::New(env, "Chaîne attendue").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Extraire mot de passe
  std::string password = info[0].As<Napi::String>().Utf8Value();

  // Hachage SHA-256
  unsigned char hash[SHA256_DIGEST_LENGTH];
  SHA256((unsigned char*)password.c_str(), password.length(), hash);

  // Convertir en hex
  char hex[2 * SHA256_DIGEST_LENGTH + 1];
  for (int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
    sprintf(hex + 2 * i, "%02x", hash[i]);
  }
  hex[2 * SHA256_DIGEST_LENGTH] = '\0';

  return Napi::String::New(env, hex);
}

Napi::Value VerifyPassword(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 2 || !info[0].IsString() || !info[1].IsString()) {
    Napi::TypeError::New(env, "Deux chaînes attendues").ThrowAsJavaScriptException();
    return env.Null();
  }

  std::string password = info[0].As<Napi::String>().Utf8Value();
  std::string storedHash = info[1].As<Napi::String>().Utf8Value();

  // Hacher mot de passe saisi
  unsigned char hash[SHA256_DIGEST_LENGTH];
  SHA256((unsigned char*)password.c_str(), password.length(), hash);
  char hex[2 * SHA256_DIGEST_LENGTH + 1];
  for (int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
    sprintf(hex + 2 * i, "%02x", hash[i]);
  }
  hex[2 * SHA256_DIGEST_LENGTH] = '\0';

  bool isValid = storedHash == hex;
  return Napi::Boolean::New(env, isValid);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("hashPassword", Napi::Function::New(env, HashPassword));
  exports.Set("verifyPassword", Napi::Function::New(env, VerifyPassword));
  return exports;
}

NODE_API_MODULE(cryptoAddon, Init)