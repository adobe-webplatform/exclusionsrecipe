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

    // warning of missing CSS Shapes support shown by default
    var warning = document.getElementById('warning');

    function support() {
        var style = window.getComputedStyle(document.body, null);
        var prefixes = ['','-webkit-'];

        //returns true if CSS Shapes Level 1 is supported, prefixed or not
        //browsers without Array.some are unlikely to support CSS Shapes anyway
        return prefixes.some(function(prefix){
          return prefix + "shape-outside" in style;
        });
    }

    if (!support()) {
        warning.className = "";
    }
}, false);
