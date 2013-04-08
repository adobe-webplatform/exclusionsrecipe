// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
// http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
window.addEventListener("DOMContentLoaded", function () {
    function support() {
        var style = window.getComputedStyle(document.body, null);
        return style ? "-webkit-shape-inside" in style : false;
    }
    function getPolygon(p) {
        var l = p.getTotalLength(),
            res = [];
        for (var i = 0; i < l; i += 40) {
            var dot = p.getPointAtLength(i);
            res.push(~~dot.x + "px " + ~~dot.y + "px");
        }
        return res.join();
    }
    function sub(x, y, w, h, cx, cy, r) {
        function dist(x, y, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x, 2) +
                   Math.pow(y2 - y, 2));
        }
        var big = cx < x + w && cx > x && cy > y && cy < y + h;
        function getXY(xy) {
            var out;
            if ("y" in xy) {
                var Y = xy.y,
                    D = 4 * cx * cx -
                        4 * (cx * cx + Math.pow(Y - cy, 2) - r * r);
                if (D >= 0) {
                    out = [
                        (2 * cx + Math.sqrt(D)) / 2,
                        (2 * cx - Math.sqrt(D)) / 2
                    ];
                    (out[1] >= x + w || out[1] <= x) && out.pop();
                    (out[0] >= x + w || out[0] <= x) && out.shift();
                    return out.length ? out : null;
                } else {
                    return null;
                }
            } else {
                var X = xy.x;
                D = 4 * cy * cy -
                    4 * (cy * cy + Math.pow(X - cx, 2) - r * r);
                if (D >= 0) {
                    out = [
                        (2 * cy + Math.sqrt(D)) / 2,
                        (2 * cy - Math.sqrt(D)) / 2
                    ];
                    (out[1] >= y + h || out[1] <= y) && out.pop();
                    (out[0] >= y + h || out[0] <= y) && out.shift();
                    return out.length ? out : null;
                } else {
                    return null;
                }
            }
        }
        function getPath() {
            function run(xy, mid, mid2, end, dir) {
                if (xy) {
                    if (xy.length - 1) {
                        if (!dir) {
                            var t = mid;
                            mid = mid2;
                            mid2 = t;
                        }
                        res +=    "L" + mid2 +
                                "A" + [r, r, 0, +big, 0].concat(mid) +
                                "L" + end;
                    } else {
                        if (out) {
                            res += "L" + mid;
                        } else {
                            res +=
                                "A" + [r, r, 0, 0, 0].concat(mid) +
                                "L" + end;
                        }
                        out = !out;
                    }
                } else if (out) {
                    res += "L" + end;
                }
            }
            var out = true,
                res = "",
                points = [
                    [x, y, "y"],
                    [x + w, y, "x"],
                    [x + w, y + h, "y"],
                    [x, y + h, "x"]
                ],
                fs = {
                    x: function (i) {
                        var p = points[i];
                        xy = getXY({x: p[0]});
                        mid = xy && [p[0], xy[0]];
                        mid2 = xy && [p[0], xy[1]];
                        var next = points[i + 1] || points[0];
                        end = [next[0], next[1]];
                        run(xy, mid, mid2, end, p[1] < next[1]);
                    },
                    y: function (i) {
                        var p = points[i];
                        xy = getXY({y: p[1]});
                        mid = xy && [xy[0], p[1]];
                        mid2 = xy && [xy[1], p[1]];
                        var next = points[i + 1] || points[0];
                        end = [next[0], next[1]];
                        run(xy, mid, mid2, end, p[0] < next[0]);
                    }
                },
                xy, mid, mid2, end, cornerIn, shifted;
            for (var j = 0; j < points.length; j++) {
                var p = points[0];
                if (dist(p[0], p[1], cx, cy) > r) {
                    res = "M" + [p[0], p[1]];
                    break;
                } else {
                    points.push(points.shift());
                }
            }
            if (!res) {
                return "M0,0";
            }
            for (j = 0; j < points.length; j++) {
                fs[points[j][2]](j);
            }
            return res + "z";
        }
        return getPath();
    }
    function get(id) {
        return document.getElementById(id);
    }
    var p = get("path"),
        warning = get("warning"),
        content = get("content"),
        steps = get("steps"),
        plate = get("plate"),
        ing = [
            get("ing1"),
            get("ing2"),
            get("ing3")
        ];
    function spread(val01, start, end) {
        return start + (end - start) * val01;
    }
    var bit = function () {
        var b = 0;
        return function () {
            b++;
            if (b > 10) {
                b = 1;
            }
            return b;
        };
    }();
    if (!("orientation" in window)) {
        var desktop = function () {
            var W = content.offsetWidth;
            W = Math.max(steps.offsetWidth, W - 100 - W * .4);
            p.setAttribute("d", sub(0, 140, steps.offsetWidth,
                steps.offsetHeight, W, 340, 330));
            steps.style.WebkitShapeInside =
                "polygon(" + getPolygon(p) + ")";
            steps.style.borderBottom = "solid " + bit() + "px transparent";
            plate.style.top = "40px";
        };
    }
    function portrait() {
        p.setAttribute("d", sub(0, 0, 900, 6000, 900, 670, 430));
        steps.style.WebkitShapeInside =
            "polygon(" + getPolygon(p) + ")";
        steps.style.width = 2000 + bit() + "px";
        plate.style.top = "300px";
    }
    function landscape() {
        p.setAttribute("d", sub(0, 0, 1450, 6000, 1560, 600, 530));
        steps.style.WebkitShapeInside =
            "polygon(" + getPolygon(p) + ")";
        steps.style.width = 2000 + bit() + "px";
        plate.style.top = "400px";
    }
    function parallaxUpdate(b, g) {
        var o = window.orientation,
            pos;
        if (o == 180 || o == 90) {
            b = -b;
            g = -g;
        }
        if (o == 0 || o == 180) {
            pos = [g * 4, g, g / 4];
        } else {
            if (desktop) {
                b = spread(b / window.innerWidth, -45, 45);
                pos = [b * 4, b, b / 4];
            } else {
                pos = [b * 4, b, b / 4];
            }
        }
        for (var i = 0; i < 3; i++) {
            ing[i].style.marginLeft = Math.round(pos[i]) + "px";
        }
    }
    function orient() {
        var o = window.orientation;
        if (o == 0 || o == 180) {
            landscape();
        } else {
            portrait();
        }
    }
    window.addEventListener("deviceorientation", function (event) {
        parallaxUpdate(event.beta, event.gamma);
    }, false);
    if (desktop) {
        window.addEventListener("mousemove", function (event) {
            parallaxUpdate(event.pageX);
        }, false);
        window.addEventListener("resize", desktop, false);
        desktop();
    } else {
        window.addEventListener("orientationchange", orient, false);
        orient();
    }
    if (!support()) {
        warning.className = "";
    }
}, false);