#!/bin/bash

echo Removing unused vendor files to reduce space
rm vendor/symfony/validator/Resources/translations/*.xlf || true

echo Removing vendor files that prints php information
rm vendor/googleads/google-ads-php/scripts/print_php_information.php || true
