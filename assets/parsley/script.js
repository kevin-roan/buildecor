(function($) {

    $(document).ready(function() {

        // Option change functionality
        $('.option').on('change', function() {
            var $radio = $(this),
                $currOptGroup = $($radio.data('target')),
                $optGroups = $('.option-group');

            $optGroups.addClass('hidden');
            $currOptGroup.removeClass('hidden');
        });

        // Validation 
        var parsleyInstance = $('form').parsley();
        
        parsleyInstance.options.successClass = 'test';
        parsleyInstance.options.errorsContainer = function (ParsleyField) {
            var $topParent = ParsleyField.$element.parentsUntil('form')[ParsleyField.$element.parentsUntil('form').length - 1];
            console.log($topParent)
            return $topParent;
        };
        
        parsleyInstance.options.errorsWrapper = '<div class="test"></div>';
        parsleyInstance.options.errorTemplate = '<span></span>';
        
        console.log(parsleyInstance.options.errorTemplate);
        
        window.ParsleyValidator
            .addValidator(
                // validate if the date is completed (all 3 selectors need to have a value)
                'dobrequired',

                // 'value' will be the value selected
                // 'requirements' will be the ids of the selects
                function(value, requirements) {
                    var day = $(requirements[0]).val(),
                        month = $(requirements[1]).val(),
                        year = $(requirements[2]).val(),
                        /* 
                          Instantiate the date field as a parsley object
                          We do this because we need to add/remove error messages as all 
                          of them are attached to the date selector
                         */
                        $dobDayInstance = $(requirements[0]).parsley(),
                        errorMsg = 'Date is required';

                    /* 
                      Remove all the existing messages
                      Because the required validator has the largest priority, all other
                      error messages have to be removed.
                     */
                    window.ParsleyUI.removeError($dobDayInstance, 'dobrequired');
                    window.ParsleyUI.removeError($dobDayInstance, 'date');
                    window.ParsleyUI.removeError($dobDayInstance, 'age');

                    if (day.length && month.length && year.length) {
                        // If the date is valid, remove the error msg
                        window.ParsleyUI.removeError($dobDayInstance, 'dobrequired');

                        return true;
                    } else {
                        // If the date is not valid, add the error msg
                        window.ParsleyUI.addError($dobDayInstance, 'dobrequired', errorMsg);

                        return false;
                    }

                },
                // priority - the validator with the highest priority will be run first
                34
            )
            .addValidator(
                // validate if the selected date is valid
                // ex.: 29/02/2010 will not be valid, 29/02/2012 will
                'date',

                // 'value' will be the value selected
                // 'requirements' will be the ids of the selects
                function(value, requirements) {
                    var day = $(requirements[0]).val(),
                        month = $(requirements[1]).val(),
                        year = $(requirements[2]).val(),
                        mydate = new Date(),
                        /* 
                          Instantiate the date field as a parsley object
                          We do this because we need to add/remove error messages as all 
                          of them are attached to the date selector
                         */
                        $dobDayInstance = $(requirements[0]).parsley(),
                        errorMsg = 'Enter a valid date';

                    /* 
                     Remove the error messages of the lower priority validators
                     Because the date validator has a lower priority, its
                     error messages have to be removed.
                    */
                    window.ParsleyUI.removeError($dobDayInstance, 'date');
                    window.ParsleyUI.removeError($dobDayInstance, 'age');

                    mydate.setFullYear(year, month - 1, day);

                    if ((mydate.getDate() == day) && (mydate.getMonth() == (month - 1)) && (mydate.getFullYear() == year)) {
                        // If the current date is not identical to the converted date, it's not valid
                        window.ParsleyUI.removeError($dobDayInstance, 'date');

                        return true;
                    } else {
                        window.ParsleyUI.addError($dobDayInstance, 'date', errorMsg);

                        return false;
                    }
                },

                // priority
                33
            )
            .addValidator(
                // validate if the selected date coresponds to an age of at least 18
                'age',

                // 'value' will be the value selected
                // 'requirements' will be the ids of the selects
                function(value, requirements) {
                    var day = $(requirements[0]).val(),
                        month = $(requirements[1]).val(),
                        year = $(requirements[2]).val(),
                        mydate = new Date(),
                        currdate = new Date(),
                        age = 18,
                        /* 
                          Instantiate the date field as a parsley object
                          We do this because we need to add/remove error messages as all 
                          of them are attached to the date selector
                         */
                        $dobDayInstance = $(requirements[0]).parsley(),
                        errorMsg = 'You must be over 18 to proceed';

                    // Remove only the corresponding error msg as this is the last validator
                    window.ParsleyUI.removeError($dobDayInstance, 'age');

                    // Selected birth date
                    mydate.setFullYear(year, month - 1, day);
                    // We substract the minimum age from the current date
                    currdate.setFullYear(currdate.getFullYear() - age);

                    if (currdate >= mydate) {
                        /* 
                         We compare the minimum valid birth date (current date minus the minimum age)
                         to the current date. The first one needs to be greater or equal to the second
                         one in order to have a valid birth date.
                         */
                        window.ParsleyUI.removeError($dobDayInstance, 'age');

                        return true;
                    } else {
                        window.ParsleyUI.addError($dobDayInstance, 'age', errorMsg);

                        return false;
                    }
                },

                // priority
                32
            );

    });

})(jQuery);