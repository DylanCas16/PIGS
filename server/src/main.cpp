#ifdef _WIN32
#ifndef _WIN32_WINNT
  #define _WIN32_WINNT 0x0A00
#endif
#define CPPHTTPLIB_NO_UWP_SUPPORT
#endif

#include "helpers.h"
#include "routes/supplies.h"
#include "routes/items.h"
#include "routes/recipes.h"
#include <iostream>

int main() {
    httplib::Server svr;

    register_supply_routes(svr);
    register_item_routes(svr);
    register_recipe_routes(svr);

    svr.Options(R"(/.*)", [](const httplib::Request&, httplib::Response& res) {
        set_cors(res);
        res.status = 200;
    });

    std::cout << "API PIGS listening on http://localhost:8080" << std::endl;
    svr.listen("0.0.0.0", 8080);
    return 0;
}