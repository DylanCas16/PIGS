cmake_minimum_required(VERSION 3.10)
project(PIGS LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Threads REQUIRED)

if(WIN32)
    set(OPENSSL_PATH "C:/Program Files/OpenSSL-Win64")
    set(OPENSSL_INCLUDE_DIR "${OPENSSL_PATH}/include")
    set(OPENSSL_LIB_DIR "${OPENSSL_PATH}/lib/VC/x64/MD")
    set(OPENSSL_CRYPTO_LIBRARY "${OPENSSL_LIB_DIR}/libcrypto.lib" CACHE INTERNAL "")
    set(OPENSSL_SSL_LIBRARY "${OPENSSL_LIB_DIR}/libssl.lib" CACHE INTERNAL "")

    if(EXISTS "${OPENSSL_SSL_LIBRARY}")
        message(STATUS "EXITO: Se ha encontrado libssl.lib en la carpeta MD")
    else()
        message(FATAL_ERROR "ERROR: No encuentro los archivos en ${OPENSSL_LIB_DIR}. Revisa si están dentro de MD o de MT.")
    endif()

    include_directories(${OPENSSL_INCLUDE_DIR})
    add_definitions(-D_WIN32_WINNT=0x0A00)
    add_compile_options("-Wa,-mbig-obj")
else()
    find_package(OpenSSL REQUIRED)
    set(OPENSSL_SSL_LIBRARY OpenSSL::SSL)
    set(OPENSSL_CRYPTO_LIBRARY OpenSSL::Crypto)
endif()

include_directories(include/external)

add_executable(pigs_server src/main.cpp include/external/httplib.h)

target_link_libraries(pigs_server
        PRIVATE
        "${OPENSSL_SSL_LIBRARY}"
        "${OPENSSL_CRYPTO_LIBRARY}"
        Threads::Threads
        $<$<PLATFORM_ID:Windows>:ws2_32>
        $<$<PLATFORM_ID:Windows>:crypt32>
)
