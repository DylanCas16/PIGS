#pragma once

#include "httplib.h"
#include  "json.hpp"

extern const std::string FIREBASE_HOST;

void set_cors(httplib::Response& res);