/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
layui.define(['layer', 'snow'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer;//THREE= layui.snow;
    /*var ass=layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        area: '100%,100%',
        offset:['0px','0px'],
        shadeClose: true,
        //content:'<div class="snow" style=" background:url(http://image.story521.cn/Fn7gta6esLUjLiAf8NDdkiP0joBE) no-repeat;background-size:100% 100%;; width: 100%;height: 100%;"><canvas style="width: 400px;height: 800px;"></canvas></div>'
        content: '<div style="background:url(http://image.story521.cn/Fn7gta6esLUjLiAf8NDdkiP0joBE) no-repeat;background-size:100% 100%;width: 100%;height: 100%"><canvas style="width: 100%;height: 100%"></canvas></div>'
    });*/
    var load = layer.load();
    $.get('/love/showi?id='+getUrlParam("id"),function (data) {
        layer.close(load)
        if(data.code==0){
            document.title = data.data.title;
            var //type = data.data.type;
            type="4"
            if(layui.device().android||layui.device().ios){
                $('body').append('<div class="snow" style="height:100%; background:url('+data.data.cover+') no-repeat;background-size:100% 100%;  position:fixed; left:0px; top:0px; right:0px; bottom:0px; pointer-events: none;z-index: 9999;"><canvas width="1904" height="913" style="position: absolute;left: 0;top: 0;"></canvas></div>');
            }else{
                $('body').append('<div class="snow" style="height:100%; background:url('+data.data.cover+'); position:fixed; left:0px; top:0px; right:0px; bottom:0px; pointer-events: none;z-index: 9999;"><canvas width="1904" height="913" style="position: absolute;left: 0;top: 0;"></canvas></div>');
            }
            switch (type){
                case "1":
                    makehh();
                    break;
                case "2":
                    makeHeart();
                    break;
                case "3":
                    makelove();
                    break;
                case "4":
                    makeSnow();
                    break;
                default:
                    makelove();
                    break;
            }
            //makehh();
            //$("#cover").html('<img id ="cover_img" style="max-width: 100%;max-height: 100%;height:100%;width:100%;margin: auto auto;" src="'+data.data.cover+'"/>')
            //$("#love_detail").html(data.data.content)
        }

    });
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    /******************************************************************/
    function makelove() {

        var canvas = document.querySelector("canvas"),
            ctx = canvas.getContext("2d");

        var ww, wh;

        function onResize() {
            ww = canvas.width = window.innerWidth;
            wh = canvas.height = window.innerHeight;
        }

        ctx.strokeStyle = "red";
        ctx.shadowBlur = 25;
        ctx.shadowColor = "hsla(0, 100%, 60%,0.5)";

        var precision = 100;
        var hearts = [];
        var mouseMoved = false;

        function onMove(e) {
            mouseMoved = true;
            if (e.type === "touchmove") {
                hearts.push(new Heart(e.touches[0].clientX, e.touches[0].clientY));
                hearts.push(new Heart(e.touches[0].clientX, e.touches[0].clientY));
            }
            else {
                hearts.push(new Heart(e.clientX, e.clientY));
                hearts.push(new Heart(e.clientX, e.clientY));
            }
        }

        var Heart = function (x, y) {
            this.x = x || Math.random() * ww;
            this.y = y || Math.random() * wh;
            this.size = Math.random() * 2 + 1;
            this.shadowBlur = Math.random() * 10;
            this.speedX = (Math.random() + 0.2 - 0.6) * 3;
            this.speedY = (Math.random() + 0.2 - 0.6) * 3;
            this.speedSize = Math.random() * 0.02 + 0.01;
            this.opacity = 1;
            this.vertices = [];
            for (var i = 0; i < precision; i++) {
                var step = (i / precision - 0.5) * (Math.PI * 2);
                var vector = {
                    x: (15 * Math.pow(Math.sin(step), 3)),
                    y: -(13 * Math.cos(step) - 5 * Math.cos(2 * step) - 2 * Math.cos(3 * step) - Math.cos(4 * step))
                }
                this.vertices.push(vector);
            }
        }

        Heart.prototype.draw = function () {
            this.size -= this.speedSize;
            this.x += this.speedX;
            this.y += this.speedY;
            ctx.save();
            ctx.translate(-1000, this.y);
            ctx.scale(this.size, this.size);
            ctx.beginPath();
            for (var i = 0; i < precision; i++) {
                var vector = this.vertices[i];
                ctx.lineTo(vector.x, vector.y);
            }
            ctx.globalAlpha = this.size;
            ctx.shadowBlur = Math.round((3 - this.size) * 10);
            ctx.shadowColor = "hsla(0, 100%, 60%,0.5)";
            ctx.shadowOffsetX = this.x + 1000;
            ctx.globalCompositeOperation = "screen"
            ctx.closePath();
            ctx.fill()
            ctx.restore();
        };


        function render(a) {
            requestAnimationFrame(render);

            hearts.push(new Heart())
            ctx.clearRect(0, 0, ww, wh);
            for (var i = 0; i < hearts.length; i++) {
                hearts[i].draw();
                if (hearts[i].size <= 0) {
                    hearts.splice(i, 1);
                    i--;
                }
            }
        }


        onResize();
        window.addEventListener("mousemove", onMove);
        window.addEventListener("touchmove", onMove);
        window.addEventListener("resize", onResize);
        requestAnimationFrame(render);
    }

    function makeHeart() {
        var hearts = [];
        var canvas = document.querySelector("canvas");
        var wW = window.innerWidth;
        var wH = window.innerHeight;
        // 创建画布
        var ctx = canvas.getContext('2d');
        // 创建图片对象
        var heartImage = new Image();
        heartImage.src = '/layui/images/love/heart.svg';
        var num = 100;

        init();

        window.addEventListener('resize', function(){
            wW = window.innerWidth;
            wH = window.innerHeight;
        });
        // 初始化画布大小
        function init(){
            canvas.width = wW;
            canvas.height = wH;
            for(var i = 0; i < num; i++){
                hearts.push(new Heart(i%5));
            }
            requestAnimationFrame(render);
        }

        function getColor(){
            var val = Math.random() * 10;
            if(val > 0 && val <= 1){
                return '#eccfff';
            } else if(val > 1 && val <= 2){
                return '#f00';
            } else if(val > 2 && val <= 3){
                return '#0f0';
            } else if(val > 3 && val <= 4){
                return '#368';
            } else if(val > 4 && val <= 5){
                return '#fff69e';
            } else if(val > 5 && val <= 6){
                return '#333';
            } else if(val > 6 && val <= 7){
                return '#f50';
            } else if(val > 7 && val <= 8){
                return '#e96d5b';
            } else if(val > 8 && val <= 9){
                return '#5be9e9';
            } else {
                return '#d41d50';
            }
        }

        function getText(){
            var val = Math.random() * 10;
            if(val > 1 && val <= 3){
                return '爱你一辈子';
            } else if(val > 3 && val <= 5){
                return '感谢你';
            } else if(val > 5 && val <= 8){
                return '喜欢你';
            } else{
                return 'i love u';
            }
        }

        function Heart(type){
            this.type = type;
            // 初始化生成范围
            this.x = Math.random() * wW;
            this.y = Math.random() * wH;

            this.opacity = Math.random() * .5 + .5;

            // 偏移量
            this.vel = {
                x: (Math.random() - .5) * 5,
                y: (Math.random() - .5) * 5
            }

            this.initialW = wW * .5;
            this.initialH = wH * .5;
            // 缩放比例
            this.targetScale = Math.random() * .15 + .02; // 最小0.02
            this.scale = Math.random() * this.targetScale;

            // 文字位置
            this.fx = Math.random() * wW;
            this.fy = Math.random() * wH;
            this.fs = Math.random() * 10;
            this.text = getText();

            this.fvel = {
                x: (Math.random() - .5) * 5,
                y: (Math.random() - .5) * 5,
                f: (Math.random() - .5) * 2
            }
        }

        Heart.prototype.draw = function(){
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.drawImage(heartImage, this.x, this.y, this.width, this.height);
            ctx.scale(this.scale + 1, this.scale + 1);
            if(!this.type){
                // 设置文字属性
                ctx.fillStyle = getColor();
                ctx.font =  this.fs + 'px 隶书';
                // 填充字符串
                ctx.fillText(this.text, this.fx, this.fy);
            }
            ctx.restore();
        }
        Heart.prototype.update = function(){
            this.x += this.vel.x;
            this.y += this.vel.y;

            if(this.x - this.width > wW || this.x + this.width < 0){
                // 重新初始化位置
                this.scale = 0;
                this.x = Math.random() * wW;
                this.y = Math.random() * wH;
            }
            if(this.y - this.height > wH || this.y + this.height < 0){
                // 重新初始化位置
                this.scale = 0;
                this.x = Math.random() * wW;
                this.y = Math.random() * wH;
            }

            // 放大
            this.scale += (this.targetScale - this.scale) * .1;
            this.height = this.scale * this.initialH;
            this.width = this.height * 1.4;

            // -----文字-----
            this.fx += this.fvel.x;
            this.fy += this.fvel.y;
            this.fs += this.fvel.f;

            if(this.fs > 50){
                this.fs = 2;
            }

            if(this.fx - this.fs > wW || this.fx + this.fs < 0){
                // 重新初始化位置
                this.fx = Math.random() * wW;
                this.fy = Math.random() * wH;
            }
            if(this.fy - this.fs > wH || this.fy + this.fs < 0){
                // 重新初始化位置
                this.fx = Math.random() * wW;
                this.fy = Math.random() * wH;
            }
        }

        function render(){
            ctx.clearRect(0, 0, wW, wH);
            for(var i = 0; i < hearts.length; i++){
                hearts[i].draw();
                hearts[i].update();
            }
            requestAnimationFrame(render);
        }
    }
    function makehh() {
        var b = document.body;
        var c = document.querySelector("canvas");
        var a = c.getContext('2d');
        eval('var M=Math,n=M.pow,i,E=2,F="rgba(233,61,109,",d=M.cos,z=M.sin,L=1,u=30,W=window,w=c.width=W.innerWidth,h=c.height=W.innerHeight,r=_1){return M.random()*2-1},y="px Arial",v="♥",q="♥",X=w/2,Y=h/2,T=4,p=_1){var e=this;e.g=_1){e.x=X;e.y=Y;e.k=0;e.l=0;e.t=M.random()*19000;e.c=e.t};e.d=_1){a.fillStyle=F+(e.c/e.t)+")";a.fillText(q,e.x,e.y);e.c-=50;e.x+=e.k;e.y+=e.l;e.k=e.k+r();e.l=e.l+r();if(e.c<0||e.x>w||e.x<0||e.y>h||e.y<0){e.g()}};e.g()},A,B;a.textAlign="center";a.strokeStyle="#000";a.lineWidth=2;for(i=0;i<350;i++){M[i]=new p()}setInterval(_1){a.clearRect(0,0,w,h);a.font=u+y;X=(w/6*n(z(T),3)+w/2);Y=0.8*(-h/40*(13*d(T)-5*d(2*T)-2*d(3*T)-d(4*T))+h/2.3);T+=(z(T)+3)/99;for(i=0;i<350;i++){with(M[i]){A=(x/w-0.5)*2,B=-(y/h-0.5);if(L&&(A*A+2*n((B-0.5*n(M.abs(A),0.5)),2))>0.11){k=l=0}d()}}a.font=30+y;if(E>0.1){if(E<1){a.fillStyle=F+E+")";a.fillText("爱我",w/2,h/2)}E-=0.02}a.fillStyle="#E93D6D";a.fillText(v,X,Y+u);},50);b.bgColor="#FFEFF2";c.onmouseup=_1){L=(L)?0:1}'.replace(/(_1)/g,'function('));
    }

    function makeSnow() {

        var container = document.querySelector(".snow");
        var canvas = document.querySelector("canvas");

        if (/MSIE 9|MSIE 10/.test(navigator.userAgent)) {
            $(container).bind('click mousemove', function (evt) {
                this.style.display = 'none';
                var x = evt.pageX, y = evt.pageY
                if ($(document).scrollTop() > 0 || $(document).scrollTop() > 0) {
                    x = x - $(document).scrollLeft() + 1
                    y = y - $(document).scrollTop() + 1
                }
                evt.preventDefault();
                evt.stopPropagation();
                var under = document.elementFromPoint(x, y);
                var evtType = evt.type === 'click' ? 'click' : 'mouseenter'
                if (evt.type === 'click') {
                    $(under)[0].click();
                } else {
                    $(under).trigger('mouseenter');
                }
                $('body').css('cursor', 'default')
                this.style.display = '';
                return false;
            });
        }
        var containerWidth = window.innerWidth;
        var containerHeight = window.innerHeight;
        var particle;
        var camera;
        var scene;
        var renderer;
        var mouseX = 0;
        var mouseY = 0;
        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;
        var particles = [];
        var particleImages = [new Image(), new Image(), new Image(), new Image(), new Image()];
        particleImages[0].src = "/layui/images/love/snow/snow1.png";
        particleImages[1].src = "/layui/images/love/snow/snow2.png";
        particleImages[2].src = "/layui/images/love/snow/snow3.png";
        particleImages[3].src = "/layui/images/love/snow/snow4.png";
        particleImages[4].src = "/layui/images/love/snow/snow5.png";
        var snowNum = 300;

        var ctx = canvas.getContext('2d');
        function init() {
            camera = new $.THREE.PerspectiveCamera(75, containerWidth / containerHeight, 1, 10000);
            camera.position.z = 1000;
            scene = new $.THREE.Scene();
            scene.add(camera);
            renderer = new $.THREE.CanvasRenderer();
            renderer.setSize(containerWidth, containerHeight);
            for (var i = 0; i < snowNum; i++) {
                var material = new $.THREE.ParticleBasicMaterial({map: new $.THREE.Texture(particleImages[i % 5])});
                particle = new Particle3D(material);
                particle.position.x = Math.random() * 2000 - 1000;
                particle.position.y = Math.random() * 2000 - 1000;
                particle.position.z = Math.random() * 2000 - 1000;
                particle.scale.x = particle.scale.y = 1;
                scene.add(particle);
                particles.push(particle)
            }
            container.appendChild(renderer.domElement);

           /* document.addEventListener("mousemove", onDocumentMouseMove, false);
            document.addEventListener("touchstart", onDocumentTouchStart, false);
            document.addEventListener("touchmove", onDocumentTouchMove, false);*/

            setInterval(loop, 1000 / 50)
           // setInterval(drawWrod,500)
            drawWrod();
        }

       /* function onDocumentMouseMove(event) {
            mouseX = event.clientX - windowHalfX;
            mouseY = event.clientY - windowHalfY
        }

        function onDocumentTouchStart(event) {
            if (event.touches.length === 1) {
                event.preventDefault();
                mouseX = event.touches[0].pageX - windowHalfX;
                mouseY = event.touches[0].pageY - windowHalfY
            }
        }

        function onDocumentTouchMove(event) {
            if (event.touches.length === 1) {
                event.preventDefault();
                mouseX = event.touches[0].pageX - windowHalfX;
                mouseY = event.touches[0].pageY - windowHalfY
            }
        }*/
       function drawWrod() {

           var ran3 = 15;
           //var ran2 = Number(Math.random()*containerWidth/(15*ran3))
           //var ran1 = Number(Math.random()*containerHeight/ran3);
           //ctx.clearRect(0,0,10000,10000);
           ctx.fillStyle = '#f22b32';
           ctx.strokeStyle="fuchsia";
           ctx.font =   ran3+'px 楷体';
           ctx.fillText("再见2017，你好2018：新年快乐！", containerWidth-(15*16), containerHeight-30);
           ctx.save();
           var ww, wh;

           function onResize() {
               ww = canvas.width = window.innerWidth;
               wh = canvas.height = window.innerHeight;
           }

           ctx.strokeStyle = "red";
           ctx.shadowBlur = 25;
           ctx.shadowColor = "hsla(0, 100%, 60%,0.5)";

           var precision = 100;
           var hearts = [];
           var mouseMoved = false;

           function onMove(e) {
               mouseMoved = true;
               if (e.type === "touchmove") {
                   hearts.push(new Heart(e.touches[0].clientX, e.touches[0].clientY));
                   hearts.push(new Heart(e.touches[0].clientX, e.touches[0].clientY));
               }
               else {
                   hearts.push(new Heart(e.clientX, e.clientY));
                   hearts.push(new Heart(e.clientX, e.clientY));
               }
           }

           var Heart = function (x, y) {
               this.x = x || Math.random() * ww;
               this.y = y || Math.random() * wh;
               this.size = Math.random() * 2 + 1;
               this.shadowBlur = Math.random() * 10;
               this.speedX = (Math.random() + 0.2 - 0.6) * 3;
               this.speedY = (Math.random() + 0.2 - 0.6) * 3;
               this.speedSize = Math.random() * 0.02 + 0.01;
               this.opacity = 1;
               this.vertices = [];
               for (var i = 0; i < precision; i++) {
                   var step = (i / precision - 0.5) * (Math.PI * 2);
                   var vector = {
                       x: (15 * Math.pow(Math.sin(step), 3)),
                       y: -(13 * Math.cos(step) - 5 * Math.cos(2 * step) - 2 * Math.cos(3 * step) - Math.cos(4 * step))
                   }
                   this.vertices.push(vector);
               }
           }

           Heart.prototype.draw = function () {
               this.size -= this.speedSize;
               this.x += this.speedX;
               this.y += this.speedY;
               ctx.save();
               ctx.translate(-1000, this.y);
               ctx.scale(this.size, this.size);
               ctx.beginPath();
               for (var i = 0; i < precision; i++) {
                   var vector = this.vertices[i];
                   ctx.lineTo(vector.x, vector.y);
               }
               ctx.globalAlpha = this.size;
               ctx.shadowBlur = Math.round((3 - this.size) * 10);
               ctx.shadowColor = "hsla(0, 100%, 60%,0.5)";
               ctx.shadowOffsetX = this.x + 1000;
               ctx.globalCompositeOperation = "screen"
               ctx.closePath();
               ctx.fill()
               ctx.restore();
               //ctx.globalAlpha = this.size;


           };


           function render(a) {
               requestAnimationFrame(render);

               //hearts.push(new Heart())
               ctx.clearRect(0, 0, ww, wh);
               ctx.fillStyle = '#f22b32';
               ctx.strokeStyle="fuchsia";
               ctx.font =   ran3+'px 楷体';
               ctx.fillText("再见2017，你好2018：新年快乐！", containerWidth-(15*16), containerHeight-30);
               ctx.fill()
               ctx.restore();
               for (var i = 0; i < hearts.length; i++) {
                   hearts[i].draw();
                   if (hearts[i].size <= 0) {
                       hearts.splice(i, 1);
                       i--;
                   }
               }
           }


           onResize();
           window.addEventListener("mousemove", onMove);
           window.addEventListener("touchmove", onMove);
           window.addEventListener("resize", onResize);
           requestAnimationFrame(render);
       }

        function loop() {
            for (var i = 0; i < particles.length; i++) {
                var particle = particles[i];
                // 滚动到楼层模块，减少雪花 （自定义）
                if ($(window).scrollTop() < 1000) {
                    particle.scale.x = particle.scale.y = 1;
                } else {
                    if (i > particles.length / 5 * 3) {
                        particle.scale.x = particle.scale.y = 0;
                    } else {
                        particle.scale.x = particle.scale.y = 0.8;
                    }
                }
                particle.updatePhysics();
                with (particle.position) {
                    if (y < -1000) {
                        y += 2000
                    }
                    if (x > 1000) {
                        x -= 2000
                    } else {
                        if (x < -1000) {
                            x += 2000
                        }
                    }
                    if (z > 1000) {
                        z -= 2000
                    } else {
                        if (z < -1000) {
                            z += 2000
                        }
                    }
                }

            }

            camera.position.x += (mouseX - camera.position.x) * 0.005;
            camera.position.y += (-mouseY - camera.position.y) * 0.005;
            camera.lookAt(scene.position);
            renderer.render(scene, camera)
        }

        init();
    }

    exports('show', {});
});

