var slider1 = document.getElementById("currage");
var output1 = document.getElementById("currageout");
output1.innerHTML = slider1.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider1.oninput = function() {
  output1.innerHTML = this.value;
  makeGraph(output1,output2,output3,highUse)
}

var slider2 = document.getElementById("startage");
var output2 = document.getElementById("startageout");
output2.innerHTML = slider2.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider2.oninput = function() {
  output2.innerHTML = this.value;
  makeGraph(output1,output2,output3,highUse)
}

var slider3 = document.getElementById("uselvl");
var output3 = document.getElementById("uselvlout");
output3.innerHTML = slider3.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider3.oninput = function() {
  output3.innerHTML = this.value;
  makeGraph(output1,output2,output3,highUse)
}
var highUse=1
function changeFunc() {
    var selectBox = document.getElementById("usehigh");
    highUse = selectBox.options[selectBox.selectedIndex].value;
    makeGraph(output1,output2,output3,highUse)
   }
// Create graph
function makeGraph(output1,output2,output3,highUse) {
    var duration=parseInt(output1.innerHTML)-parseInt(output2.innerHTML)+1;
    var height=parseInt(output3.innerHTML)*parseInt(highUse)+1;
    var numSquares=Array(duration).fill(0);
    numSquares[duration-1]=parseInt(output3.innerHTML);
    data=[]
    for (i=0;i<duration;i++) {
        for (j=0;j<height;j++) {
            data.push([i,j])
        }
    }
    var svgArea = d3.select("#graph").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }
    // set year SVG dimension
    var svgHeight=800;
    var svgWidth=document.getElementById("graph").offsetWidth;
    // create svg container
    var svg = d3.select("#graph").append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);
    // each year as an svg rectangle
    var svgGroup=svg.append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x",(d) => {
            return (svgWidth-40)/duration*d[0]+40;
        })
        .attr("y",(d) => {
            return (svgHeight-40)/height*d[1];
        })
        .attr("width",(d) => {
            return (svgWidth-40)/duration;
        })
        .attr("height",(d) => {
            return (svgHeight-40)/height;
        })
        .attr("fill",(d)=> {
            if (d[0]==duration-1) {
                if (d[1]==height-parseInt(output3.innerHTML)-1) { 
                return color[1]
            } else {return color[0]}}
            else {return color[0]}
        })
        .attr("stroke","grey")
        .text(d => {return d[i]})
        // when a year is selected
        .on("click",function(d) {
            if (d3.select(this).attr("fill")==color[0]) {
                d3.select(this).attr("fill",color[1])
                if (parseInt(output3.innerHTML-d3.select(this).data()[0][1])>numSquares[d3.select(this).data()[0][0]]) {
                    numSquares[d3.select(this).data()[0][0]]=parseInt(output3.innerHTML-d3.select(this).data()[0][1])
                    document.getElementById("totalSquares").innerHTML=(numSquares.reduce((a,b)=>a+b,0)*52.1429)+" "+document.getElementById("usetype").value+"s";
                }
            }
            else {
                d3.select(this).attr("fill",color[0])
                var greyRects=document.querySelectorAll('[fill="grey"]');
                var bigRect=svgHeight+200
                for (i=0;i<greyRects.length;i++) {
                    if ((Math.round(greyRects[i].x.animVal.value)==Math.round(d3.select(this).attr("x"))) && (greyRects[i].y.animVal.value<bigRect)) {
                        bigRect=greyRects[i].y.animVal.value 
                    }
                }
                if (bigRect < svgHeight+200) {
                    numSquares[d3.select(this).data()[0][0]]=(height-(bigRect/(svgHeight-40)*height)-1)
                }
                else {
                    numSquares[d3.select(this).data()[0][0]]=0
                }
                document.getElementById("totalSquares").innerHTML=(numSquares.reduce((a,b)=>a+b,0)*52.1429)+" "+document.getElementById("usetype").value+"s";
            }
            
        })
        svg.append("g")
            .selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x",(d,index) => {
                return (svgWidth-40)/duration*d[0]+40;
            })
            .attr("y",(svgHeight-30))
            .attr("font-size","10px")
            .text(d=>{
                if (d[0]/5==Math.round(d[0]/5)) {
                    return d[0]+parseInt(output2.innerHTML)
                }})
         svg.append("g")
            .selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x",25)
            .attr("y",(d,index) => {
                return svgHeight-40-(d[1]*((svgHeight-40)/height));
            })
            .attr("font-size","10px")
            .text(d=>{
                if (d[1]/5==Math.round(d[1]/5)) {
                    return d[1]
                }})
        svg.append("text")
            .attr("x",(svgWidth/2))
            .attr("y",svgHeight-5)
            .attr("font-size","16px")
            .attr("class","axislabel")
            .text("AGE")
        svg.append("text")
            .attr("x",12)
            .attr("y",svgHeight/2)
            .attr("transform",`rotate(-90,12,${svgHeight/2})`)
            .attr("font-size","16px")
            .attr("class","axislabel")
            .text("Average number of "+document.getElementById("usetype").value+"s per week")
}
color=["white","grey"]