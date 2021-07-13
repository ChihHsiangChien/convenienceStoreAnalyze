// https://observablehq.com/@abebrath/scatterplot-of-text-labels@2096
import define1 from "./a33468b95d0b15b0@703.js";
import define2 from "./e93997d5089d7165@2303.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["BirthDeath_pop_sort.csv",new URL("./files/1f2d6ad21414ead35d4c924eb71ea38db53ab1f54464a1a13efb975994e9fe9c7f7ae8d3e93240c35569ea5f6f15d83b3835f125ada9822fc66ba42918256fad",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Scatterplot of Text Labels`
)});
  main.variable(observer()).define(["md"], function(md){return(
md` In this scatterplot, 186 countries are shown as bubbles or standard country ISO-codes. Clicking the checkbox toggles bubble and text label visibility. In both views, interactive tooltips provide details including country identification, population, etc. But interactivity should not be assumed: snapshots, presentations, print, and other uses may not have interaction. 

Labels allow the user to quickly identify which datapoint they are looking at faster than with interaction. For an English language speaker, most of the two letter codes reflect the significant, unique letters of the country name. Near the top right are country codes MW, ZM, NE, RW and UG, which a viewer may recognize by the similarity to corresponding country names Malawi, Zambia, Niger, Rwanda and Uganda.


The labels also offer other benefits. The viewer may notice that countries near each other in the plot tend to be geographically proximate. Near the top left – UA, LV, RU, EE, BG corresponding to Ukraine, Latvia, Russia, Estonia, Bulgaria – are all countries associated with the former eastern bloc. For more information, this example and other text-label plots are described in the book *Visualizing with Text* (Richard Brath, 2020, [A.K. Peters](https://www.routledge.com/Visualizing-with-Text/Brath/p/book/9780367259266), [Amazon](https://www.amazon.com/Visualizing-Text-AK-Peters-Visualization-dp-0367259265/dp/0367259265)).`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<h1 class="title">BIRTH RATE vs DEATH RATE by country</h1>`
)});
  main.variable(observer("viewof state")).define("viewof state", ["checkbox"], function(checkbox){return(
checkbox({
  options: [
    { value: "toggle", label: "Toggle Bubbles/Country Codes" },
  ],
})
)});
  main.variable(observer("state")).define("state", ["Generators", "viewof state"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["data","d3","width","height","xAxis","yAxis","x","y","r","color","tooltip","legend","invalidation"], function(data,d3,width,height,xAxis,yAxis,x,y,r,color,tooltip,legend,invalidation)
{
  
  const nodes = data;

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])

  //create background
  svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("class", "svgBackground");
  
  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);
  
  //Create the datapoints as circles with radius and colour corresponding to population size
  const bubble = svg.append("g")
      .attr("stroke-width", 1)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("opacity", 0.75)
      .attr("cx", d => x(d.birthRate))
      .attr("cy", d => y(d.deathRate))
      .attr("r",  d => r(d.population))
      .attr("stroke", d => color(d.population))
      .attr("fill",   d => color(d.population))
   bubble.append("title")
      .text(tooltip)

  //Create the ISO country codes as text elements
  const label = svg.append("g")
      .attr("font-family", "Yanone Kaffeesatz")
      .attr("font-weight", 700)
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(data)
    .join("text")
      .attr("id", "isoCode")
      .attr("opacity", 0)
      .attr("dy", "0.35em")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("font-size", d => r(d.population)*1.5)
      .attr("fill", d => color(d.population))
      .text(d => d.code);
  //add a title to act as a mousover tooltip, function tooltip() defined in a cell bleow
  label.append("title")
      .text(tooltip);
  
  const legend1 = svg.append("g")
     .attr("transform", `translate(${width - 340} ${height - 90})`)
     .append(() => legend({
        color: color, // <= this is the scale "color" being passed into field "color"
        title: "Population (in millions)",
        ticks: 4,
        tickFormat: d => d3.format(",.0f")(d / 1000000)
      }))
  
// sort of hack-y collision here - we are approximating the text labels as "square" (only possible due to the short 2 char ISO codes) with a maximum radius aprox. equal to the radius of the corresponding bubble (bubble_rad*0.7) and running collision on that. This is not true rectangular text element collision detection - see my Pokemon Force Graph for that.
  
    const simulation = d3.forceSimulation(nodes)
                       .force("collide", d3.forceCollide(d => d.radius * 0.7))
                       .force("x", d3.forceX(d => d.x0))
                       .force("y", d3.forceY(d => d.y0));
  
    simulation.on("tick", () => {
     label.attr("x", d => d.x)
          .attr("y", d => d.y);
  });

  invalidation.then(() => simulation.stop());
  
  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`Collision detection is used on the text labels using D3's force library. Overlapping text is difficult to read. If the text is not legible due to overlap then the benefits of using labels is lost.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `## Data and Functions`
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
Object.assign(d3.csvParse(await FileAttachment("BirthDeath_pop_sort.csv").text(), 
                                 ({country, code, population, birth_rate, death_rate}) => 
                                 ({country, code, population: +population, birthRate: +birth_rate,
                                   deathRate: +death_rate})),
                                  {xLabel: "Birth Rate (per 1000 people) →",
                                   yLabel: "↑ Death Rate (per 1000 people)"})
)});
  main.variable(observer()).define(["data","x","y","r"], function(data,x,y,r)
{
  data.forEach(function(d){
    d.x0 = x(d.birthRate)  //home x-position
    d.y0 = y(d.deathRate)  //home y-position
    d.radius = r(d.population)  // radius (const)
  })
}
);
  main.variable(observer("tooltip")).define("tooltip", ["d3"], function(d3){return(
function(d){
            return d.code + ": " + d.country +
            "\nBirth Rate: " + d.birthRate +
            "\nDeath Rate: " + d.deathRate +
            "\nPopulation: " + d3.format(",.3f")(d.population / 1000000) + "m";}
)});
  main.variable(observer()).define(["d3","state"], function(d3,state)
{
     d3.selectAll("circle")
         .transition()
         .duration(200)
         .style("fill-opacity", (state === "toggle")? 0:1) 
      d3.selectAll("text#isoCode")
         .transition()
         .duration(200)
         .style("opacity", (state === "toggle")? 1:0)
}
);
  main.variable(observer()).define(["md"], function(md){return(
md `## Scales, Axes and Legends`
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleLinear()
  .domain([d3.min(data, d => d.birthRate) * 0.9, d3.max(data, d => d.birthRate)])
  .range([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], function(d3,data,height,margin){return(
d3.scaleSqrt()
  .domain([d3.min(data, d => d.deathRate) * 0.9, d3.max(data, d => d.deathRate)])
  .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("r")).define("r", ["d3","data"], function(d3,data){return(
d3.scaleSqrt()
  .domain(d3.extent(data, d => d.population))
  .range([9,25])
)});
  main.variable(observer("color")).define("color", ["d3","data"], function(d3,data)
{
// only want a subset of the Viridis color scale. Want perceptually uniform color but high values of Viridis blend into the background too much and text is no longer legible. Piecewise CIELAB interpolation preserves Viridis' uniform colorscale as close as possible. If only 2 values of Viridis were given then it would directly interpolate between them giving something that looks nothing like Viridis. Instead we have to use a number of smaller increments to get aprox. Viridis

//Using a sequential Quantile scale because the color of the data is showing relative spread in population ranking (ie. China 1st, India 2nd, ...) not a direct comparison of population size (ie. China - 1.2bil vs.Latvia 2.4mil). Since China and India are so much larger than most other nations they act as outliers. Power / Sqrt scales could also be used but they require messing with the scaling factor.
  
  const clr = d => d3.interpolateViridis(d)
  return d3.scaleSequentialQuantile(d3.piecewise(d3.interpolateLab, 
          [clr(0), clr(0.1), clr(0.2), clr(0.3), clr(0.4), clr(0.5), clr(0.6), clr(0.7), clr(0.8), clr(0.9)]))
               .domain(data.map(d => d.population))
}
);
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width","data"], function(height,margin,d3,x,width,data){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width/100))
    .call(g => g.append("text")
        .attr("x", width)
        .attr("y", margin.bottom - 4)
        .attr("fill", "#263c54")
        .attr("text-anchor", "end")
        .text(data.xLabel))
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","data"], function(margin,d3,y,data){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 15)
        .attr("fill", "#263c54")
        .attr("text-anchor", "start")
        .attr("font-family", "Lato")
        .attr("font-weight", 400)
        .text(data.yLabel))
)});
  main.variable(observer()).define(["md"], function(md){return(
md `## Appendix`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  const child1 = runtime.module(define1);
  main.import("legend", child1);
  const child2 = runtime.module(define2);
  main.import("checkbox", child2);
  main.variable(observer("margin")).define("margin", function(){return(
{top: 20, right: 20, bottom: 35, left: 40}
)});
  main.variable(observer("height")).define("height", function(){return(
600
)});
  main.variable(observer()).define(["html"], function(html){return(
html`
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@700&display=swap" rel="stylesheet">
<style>

  .svgBackground {fill: #fffbeb;}

  .title {
       font: 24px "Lato", sans-serif;
	     fill: #263c54;
	     font-weight: 700;
  }

  .other {
         font: 20px "Lato", sans-serif;
         fill: #263c54;
         font-weight: 400;
    }
</style>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Notes and Further Exploration`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The data is originally from CIA World Factbook. The latest data is [here](https://www.cia.gov/library/publications/the-world-factbook/docs/rankorderguide.html). The data above is from 1997, wrangled to get regions, country codes and flag references into a single dataset (see book for the flag version of same scatterplot). 

There are many possible interactions that could be added, for example, to animate the scatterplot like Gapminder, or have drop-downs to pick different attributes, or use toggle different color schemes, and so on. Another scatterplot in the book also uses convex hulls to show groups of related points, which could be interesting to indicate continents. The particular shape of the above dataset means that different overlay regressions could be added and compared - for example a linear regression will not be particularly representative of the data.

Sociologically, the above scatterplot poses many questions that are unanswered. Why is the birthrate / deathrate as shown? How do these variables relate to other data, such as poverty, access to clean water, access to health care, life expectancy, armed conflict, or economics? What would this data look like for different ethnicities and/or genders within a country? How could this other data be added, for example, layered in or based on selection of a subset of countries to compare? If we had a hypothesis regarding a causal data variable, how could this techique be used to show a change over time, the resulting change in hypothesized causal variable, and the validity of the hypothesis?`
)});
  return main;
}
