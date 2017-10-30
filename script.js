$(document).ready(function () {
    //one day - 9/1/2015
    //    var nasa = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-01&end_date=2015-09-01&api_key=jkFSPoYMf5xZc4YSiG24QzOEJBLThffnE7R43vbd"

    //one week - 9/1/2017 thru 9/07/2017
    var nasa = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2017-09-01&end_date=2017-09-07&api_key=jkFSPoYMf5xZc4YSiG24QzOEJBLThffnE7R43vbd"

    var astroids = [];
    var Astroid = function (day, neo_id, name, nasa_jpl_url, size_in_feet, is_dangerous, miss_distance_miles, orbiting_body, speed_mph, close_date) {
        this.day = day;
        this.neo_id = neo_id;
        this.name = name;
        this.nasa_jpl_url = nasa_jpl_url;
        this.size_in_feet = size_in_feet;
        this.is_dangerous = is_dangerous;
        this.miss_distance_miles = miss_distance_miles;
        this.orbiting_body = orbiting_body;
        this.speed_mph = speed_mph;
        this.close_date = close_date;
    };

    $.get(nasa, function (data) {
        for (var day in data.near_earth_objects) {
            processInfo(data.near_earth_objects[day], day);
        }
        displayNearMissData(astroids);
    })

    function processInfo(dayArr, day) {
        dayArr.forEach(function (element, index) {
            var astroid = new Astroid();
            var velocityArr = [];
            astroid.day = day;
            astroid.neo_id = element.neo_reference_id;
            astroid.name = element.name;
            astroid.nasa_jpl_url = element.nasa_jpl_url;
            astroid.size_in_feet = getSizeInFeet(element.estimated_diameter);
            astroid.is_dangerous = element.is_potentially_hazardous_asteroid;

            velocityArr = getVelocity(element.close_approach_data);
            astroid.close_date = velocityArr[0];
            astroid.miss_distance_miles = velocityArr[2];
            astroid.orbiting_body = velocityArr[1];
            astroid.speed_mph = velocityArr[3]

            astroids.push(astroid);
        })

        astroids.sort(function (a, b) {
            if (a.day < b.day) {
                return (-1);
            }

            if (a.day > b.day) {
                return (1);
            }

            return (0);

        });
    }

    function getVelocity(closeArr) {
        var result = [];

        closeArr.forEach(function (element) {
            var temp = null;
            result[0] = element.close_approach_date;
            result[1] = element.orbiting_body;
            temp = parseFloat(element.miss_distance.miles).toFixed(2);
            result[2] = temp.toString();
            temp = parseFloat(element.relative_velocity.miles_per_hour).toFixed(2);
            result[3] = temp;
        });

        return (result);
    }

    function getSizeInFeet(sizeArr) {
        var result = null;
        result = ((sizeArr.feet.estimated_diameter_min + sizeArr.feet.estimated_diameter_max) / 2);

        return (result.toFixed(2));
    }

    function displayNearMissData(astroidArr) {
        var displayText = '';

        astroidArr.forEach(function (element) {
            displayText = formatDisplay(element);
            $('.displayText').append(displayText);
        })

    }

    function formatDisplay(astroidObj) {
        var resultStr = null;

        resultStr = `
<article>            <strong>Astroid Name: ${astroidObj.name}</strong> <br>
                     <hr>                     
                     Neo ID: ${astroidObj.neo_id} <br>   

                     Closest Date to ${astroidObj.orbiting_body} : ${astroidObj.close_date} <br>
                     Orbiting Body: ${astroidObj.orbiting_body} <br>
                     Astroid JPL Small Body Data: <a href=${astroidObj.nasa_jpl_url}>Nasa SB Data</a><br>
                     <strong><em>Is Astroid Dangerous?:</em></strong> ${astroidObj.is_dangerous} <br>
                     Average Size in Feet: ${astroidObj.size_in_feet} <br>
                     Speed (mph): ${astroidObj.speed_mph} <br>
                     Near Miss Distance (miles): ${astroidObj.miss_distance_miles} <br>

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=<br><br>
</article>
`
        return (resultStr);

    }


})
