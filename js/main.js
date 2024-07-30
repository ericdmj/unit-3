//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap() {
    
    //map frame dimensions
    var width = 960,
        height = 460;

    //create new svg container for the map
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    //create Albers equal area conic projection centered on France
    var projection = d3.geoAlbers()
        .center([0, 38])
        .rotate([79.5, 0, 0])
        .parallels([36, 39])
        .scale(8000)
        .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);

    //use Promise.all to parallelize asynchronous data loading
    var promises = [];    
    promises.push(d3.csv("data/elections.csv")); //load attributes from csv    
    promises.push(d3.json("data/UnitedStates.topojson")); //load background spatial data    
    promises.push(d3.json("data/VirginiaMunicipalities.topojson")); //load choropleth spatial data    
    Promise.all(promises).then(callback);

    function callback(data) {
        var csvData = data[0],
            united = data[1],
            virginia = data[2];
        console.log(csvData);
        console.log(united);
        console.log(virginia);

        //translate US and Virginia TopoJSON
        var unitedStates = topojson.feature(united, united.objects.UnitedStates),
            virginiaMunicipalities = topojson.feature(virginia, virginia.objects.VirginiaMunicipalities);

        //examine the results
        console.log(unitedStates);
        console.log(virginiaMunicipalities);

        //translate US and Virginia TopoJSON
        var unitedStates = topojson.feature(united, united.objects.UnitedStates),
            virginiaMunicipalities = topojson.feature(virginia, virginia.objects.VirginiaMunicipalities).features;

        //add US States to map
        var states = map.append("path")
            .datum(unitedStates)
            .attr("class", "states")
            .attr("d", path);

        //add Virginia municipalities to map
        var municipalities = map.selectAll(".municipalities")
            .data(virginiaMunicipalities)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "municipalities " + d.properties.code;
            })
            .attr("d", path);
    }
}