#include "helpers.h"

const std::string FIREBASE_HOST = "https://alis-pigs-default-rtdb.firebaseio.com";

void set_cors(httplib::Response& res) {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type");
}