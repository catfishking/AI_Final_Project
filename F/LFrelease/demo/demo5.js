
define('F.core/support',[],function()
{
	var support = {};
	/*\
	 * support
	 * test for browser support of certain technologies, most code is adapted from other places.
	 * including
	 * - [http://davidwalsh.name/vendor-prefix](http://davidwalsh.name/vendor-prefix)
	 * - [https://gist.github.com/3626934](https://gist.github.com/3626934)
	 * - [https://gist.github.com/1579671](https://gist.github.com/3626934)
	 * [example](../sample/support.html)
	 # <iframe src="../sample/support.html" width="800" height="200"></iframe>
	\*/
	/*\
	 * support.browser
	 - (number) browser name
	 [ property ]
	\*/
	/*\
	 * support.browser_name
	 - (number) browser name
	 [ property ]
	\*/
	/*\
	 * support.browser_version
	 - (number) browser version string
	 [ property ]
	\*/
	/*\
	 * support.mobile
	 - (string) mobile device name, undefined if not on a mobile device
	 [ property ]
	\*/
	/*\
	 * support.prefix
	 - (string) browser prefix
	 [ property ]
	\*/
	/*\
	 * support.prefix_dom
	 - (string) browser prefix for DOM
	 [ property ]
	\*/
	/*\
	 * support.prefix_css
	 - (string) browser prefix for css
	 [ property ]
	\*/
	/*\
	 * support.prefix_js
	 - (string) browser prefix for js
	 [ property ]
	\*/
	/*\
	 * support.css2dtransform
	 - (string) if supported, style property name with correct prefix
	 [ property ]
	 * you can do something like
	 | if( support.css2dtransform)
	 |		element.style[support.css2dtransform]= 'translate('+P.x+'px,'+P.y+'px) ';
	\*/
	/*\
	 * support.css3dtransform
	 - (string) if supported, style property name with correct prefix
	 [ property ]
	 | if( support.css3dtransform)
	 | 	this.el.style[support.css3dtransform]= 'translate3d('+P.x+'px,'+P.y+'px, 0px) ';
	\*/

	//test for browser and device
	(function(){		
		var N= navigator.appName, ua= navigator.userAgent, tem;
		var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
		if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
		M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
		support.browser = M[0];
		support.browser_name = M[0];
		support.browser_version = M[1];
		var mobile = /iPad|iPod|iPhone|Android|webOS|IEMobile/i.exec(navigator.userAgent.toLowerCase());
		support.mobile= mobile?mobile[0]:undefined;
		//[--adapted from http://davidwalsh.name/vendor-prefix
		var styles = window.getComputedStyle(document.documentElement, ''),
			pre = (Array.prototype.slice
				.call(styles)
				.join('') 
				.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
				)[1],
			dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
		support.prefix = dom;
		support.prefix_dom = dom;
		support.prefix_css = '-'+pre+'-';
		support.prefix_js = pre[0].toUpperCase() + pre.substr(1);
		//--]
	}());

	//test for css 2d transform support
	//[--adapted from https://gist.github.com/3626934
	(function(){

		var el = document.createElement('p'), t, has3d;
		var transforms = {
			'WebkitTransform':'-webkit-transform',
			'OTransform':'-o-transform',
			'MSTransform':'-ms-transform',
			'MozTransform':'-moz-transform',
			'transform':'transform'
		};

		/* Add it to the body to get the computed style.*/
		document.getElementsByTagName('body')[0].appendChild(el);

		for(t in transforms)
		{
			if( el.style[t] !== undefined )
			{
				var str;
				str = 'matrix(1, 0, 0, 1, 0, 0)';
				el.style[t] = str;
				if( str===window.getComputedStyle(el).getPropertyValue( transforms[t] ))
					support.css2dtransform= t;

				str = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1)'
				el.style[t] = str;
				//if( str===window.getComputedStyle(el).getPropertyValue( transforms[t] ))
				if( window.getComputedStyle(el).getPropertyValue( transforms[t] ).indexOf('matrix3d')===0)
					support.css3dtransform= t;
			}
		}

		el.parentNode.removeChild(el);
	}());
	//--] end

	//support requestAnimationFrame
	//[--adapted from https://gist.github.com/1579671
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

	// requestAnimationFrame shim by Erik Möller
	// fixes from Paul Irish and Tino Zijdel
	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
			|| window[vendors[x]+'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
					timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
			};
	}());
	//--] end

	return support;
});

/*\
 * util.js
 * utilities for F.LF
\*/

define('LF/util',[],function(){

if (typeof console==='undefined')
{	//polyfill for IE, this is just for precaution
	// we should not use console.log in production anyway
    console={};
    console.log = function(){}
}

var util={};

util.selectA_from=function(from,where,option)
{
	var res=[];
	for( var i in from)
	{
		var O=from[i];
		var match=true;
		if( typeof where==='function')
		{
			if( !where(O))
				match=false;
		}
		else
			for( var j in where)
			{
				if( O[j]!==where[j])
					match=false;
			}
		if( match)
			res.push(O);
	}
	return res; //always return an array
}

util.select_from=function(from,where,option)
{
	var res = util.selectA_from(from,where,option);
	if( res.length===0)
		return ;
	else if( res.length===1)
		return res[0]; //return an item
	else
		return res;
}

util.lookup=function(A,x)
{
	for( var i in A)
	{
		if( x<=i)
			return A[i];
	}
}

util.lookup_abs=function(A,x)
{
	if( x<0) x=-x;
	for( var i in A)
	{
		if( x<=i)
			return A[i];
	}
	return A[i];
}

util.shallow_copy=function(A)
{
	var B={};
	for( var i in A)
		B[i] = A[i];
	return B;
}

util.div=function(classname)
{
	if( !util.container)
	{
		util.root = document.getElementsByClassName('LFroot')[0];
		util.container = util.root.getElementsByClassName('container')[0];
	}
	if( !classname) return util.container;
	return util.root.getElementsByClassName(classname)[0];
}

util.filename=function(file)
{
	if( file.lastIndexOf('/')!==-1)
		file = file.slice(file.lastIndexOf('/')+1);
	if( file.lastIndexOf('.js')!==-1)
		file = file.slice(0,file.lastIndexOf('.js'));
	return file;
}

/**
The resourcemap specified by F.core allows putting a js function as a condition checker.
This is considered insecure in F.LF. thus F.LF only allows simple predefined condition checking.
*/
util.setup_resourcemap=function(package)
{
	if( package.resourcemap)
	if( typeof package.resourcemap.condition==='string')
	{
		var cond = package.resourcemap.condition.split(' ');
		if( cond[0]==='location' && cond[1]==='contain' &&
			cond[2] && cond[3]==='at' && cond[4])
		{
			cond[4]=parseInt(cond[4]);
			package.resourcemap.condition = function()
			{
				return window.location.href.indexOf(cond[2])===cond[4];
			}
		}
		else if( cond[0]==='location' && cond[1]==='contain' && cond[2])
		{
			package.resourcemap.condition = function()
			{
				return window.location.href.indexOf(cond[2])!==-1;
			}
		}

		if( typeof package.resourcemap.condition==='function')
		{
			var resmap = [
				package.resourcemap, //package-defined resourcemap
				{	//default resourcemap
					get: function(res)
					{
						return package.location+res;
					}
				}
			];
			return resmap;
		}
	}
}

//return the parameters passed by location
util.location_parameters=function()
{
	var param = window.location.href.split('/').pop(),
		query = {};
	if( param.indexOf('?')!==-1)
	{
		var param = param.split('?').pop().split('&');
		for( var i=0; i<param.length; i++)
		{
			pp = param[i].split('=');
			if( pp.length===1)
				query[pp[0]] = 1;
			if( pp.length===2)
				query[pp[0]] = pp[1];
		}
	}
	return query;
}

util.organize_package=function(package)
{
	for( var i=0; i<package.data.object.length; i++)
	{
		if( package.data.object[i].type==='character')
		{
			//if `deep.js` is of type character, select all files matching `deep_*`
			var name = util.filename(package.data.object[i].file);
			var objects = util.selectA_from(package.data.object,function(O){
				if( !O.file) return false;
				var file = util.filename(O.file);
				if( file===name) return false;
				if( file.lastIndexOf('_')!==-1)
					file = file.slice(0,file.lastIndexOf('_'));
				return file===name;
			});
			package.data.object[i].pack = objects; //each character has a specialattack pack
		}
	}
}

return util;
});

/*\
 * global.js
 * 
 * global constants of a game
 * 
 * note to data changers: tweak entries in this file very carefully. do not add or delete entries.
\*/
define('LF/global',['LF/util'],function(util)
{

var G={};

G.application={};
var GA = G.application;
GA.window={};
GA.window.width=794;
GA.window.wide_width=1000;
GA.window.height=550;
GA.viewer={};
GA.viewer.height=400;
GA.camera={};
GA.camera.speed_factor=1/18;

/*\
 * global.combo_list
 [ property ]
 * list of combos
 | { name:'DvA', seq:['def','down','att']} //example
\*/
G.combo_list = [
	{ name:'D<A', seq:['def','left','att'], clear_on_combo:false},
	{ name:'D>A', seq:['def','right','att'], clear_on_combo:false},
	{ name:'DvA', seq:['def','down','att']},
	{ name:'D^A', seq:['def','up','att']},
	{ name:'D<J', seq:['def','left','jump']},
	{ name:'D>J', seq:['def','right','jump']},
	{ name:'DvJ', seq:['def','down','jump']},
	{ name:'D^J', seq:['def','up','jump']},
	{ name:'D<AJ', seq:['def','left','att','jump']},
	{ name:'D>AJ', seq:['def','right','att','jump']},
	{ name:'DJA', seq:['def','jump','att']}
];
G.combo_tag =
{	//look up from combo name to tag name
	'def':'hit_d',
	'jump':'hit_j',
	'att':'hit_a',
	'D<A':'hit_Fa',
	'D>A':'hit_Fa',
	'DvA':'hit_Da',
	'D^A':'hit_Ua',
	'D<J':'hit_Fj',
	'D>J':'hit_Fj',
	'DvJ':'hit_Dj',
	'D^J':'hit_Uj',
	'D<AJ':'hit_Fj',
	'D>AJ':'hit_Fj',
	'DJA':'hit_ja'
};
G.combo_priority =
{	//larger number is higher priority
	'up':0,'down':0,'left':0,'right':0,'def':0,'jump':0,'att':0,'run':0,
	'D>A':1, 'D<A':1, 'DvA':1, 'D^A':1,
	'DvJ':1, 'D^J':1, 'D>J':1, 'D<J':1, 'D<AJ':1, 'D>AJ':1, 'DJA':1
};

G.lazyload = function(folder,O) //return true to delay loading of data files
{
	if( folder==='object')
	{
		if( !this.character_list)
			this.character_list={};
		if( O.type==='character')
		{
			var file = util.filename(O.file);
			this.character_list[file] = true;
			return true; //delay loading of all character files
		}
		else if( O.type)
		{
			var file = util.filename(O.file);
			if( file.lastIndexOf('_')!==-1)
				file = file.slice(0,file.lastIndexOf('_'));
			/** delay loading of all character prefixed files. consider,
				{id: 1, type:'character', file:'data/deep.js'},
				{id:203, type:'specialattack', file:'data/deep_ball.js'}
				as `deep.js` is of type character, any files matching `deep_*` will also be lazy loaded
			*/
			if( this.character_list[file])
				return true;
		}
	}
	else if( folder==='background')
	{
		return true;
	}
	else if ( folder==='AI')
	{
		return true;
	}
	return false;
};

G.gameplay={};
var GC = G.gameplay;

/*\
 * global.gameplay.default
 [ property ]
 * What are the defaults?
 * 
 * default means `otherwise specified`. all defaults get overridden, and (mostly) you can set the specific property in data files. so it might not be meaningful to change default values.
 * if any of them cannot be overridden, please move them out of default.
\*/
GC.default={};
GC.default.health={};
GC.default.health.hp_full=500;
GC.default.health.mp_full=500;
GC.default.health.mp_start=200; //it cannot be overriden

GC.default.itr={};
GC.default.itr.zwidth= 12; //default itr zwidth
GC.default.itr.hit_stop= 3; //default stall when hit somebody
GC.default.itr.throw_injury= 10;

GC.default.cpoint={};
GC.default.cpoint.hurtable= 0; //default cpoint hurtable
GC.default.cpoint.cover= 0; //default cpoint cover
GC.default.cpoint.vaction= 135; //default frame being thrown

GC.default.wpoint={};
GC.default.wpoint.cover= 0;

GC.default.effect={};
GC.default.effect.num= 0; //default effect num

GC.default.fall={};
GC.default.fall.value= 20; //default fall
GC.default.fall.dvy= -6.9; //default dvy when falling

GC.default.weapon={};
GC.default.weapon.vrest= 9; //default weapon vrest

GC.default.character={};
GC.default.character.arest= 7; //default character arest

GC.default.machanics={};
GC.default.machanics.mass= 1; //default mass; weight = mass * gravity

/*\
 * global.gameplay
 [ property ]
 * gameplay constants
 * 
 * these are defined constants over the game, tweak them carefully otherwise it might introduce bugs
\*/

GC.recover={};
GC.recover.fall= -0.45; //fall recover constant
GC.recover.bdefend= -0.5; //bdefend recover constant

GC.effect={};
GC.effect.num_to_id= 300; //convert effect num to id
GC.effect.duration= 3; //default effect lasting duration
GC.effect.heal_max= 100; //the max hp that can be recovered by healing effects

GC.character={};
GC.character.bounceup={}; //bounce up during fall
GC.character.bounceup.limit={};
GC.character.bounceup.limit.xy= 13.4; //defined speed threshold to bounce up again
GC.character.bounceup.limit.y= 11; //y threshold; will bounce if any one of xy,y is overed
GC.character.bounceup.y= 4.25; //defined bounce up speed
GC.character.bounceup.absorb= //how much dvx to absorb when bounce up
{
	9:1,
	14:4,
	20:10,
	40:20,
	60:30
}

GC.defend={};
GC.defend.injury={};
GC.defend.injury.factor= 0.1; //defined defend injury factor; meaning only that portion of injury will be done for an effective defence
GC.defend.break_limit= 40; //defined defend break
GC.defend.absorb= //how much dvx to absorb when defence is broken
{	//look up table
	5:0,
	15:5
}

GC.fall={};
GC.fall.KO= 60; //defined KO
GC.fall.wait180= //the wait of 180 depends on effect.dvy
//meaing the stronger the dvy, the longer it waits
{	//lookup
	//dvy:wait
	7:1,
	9:2,
	11:3,
	13:4,
	15:5,
	17:6
}

GC.friction={};
GC.friction.fell=    //defined friction at the moment of fell onto ground
{	//a lookup table
	//speed:friction
	2:0,
	3:1,
	5:2,
	6:4, //smaller or equal to 6, value is 4
	9:5,
	13:7,
	25:9 //guess entry
}

//physics
GC.min_speed= 1; //defined minimum speed
GC.gravity= 1.7; //defined gravity

GC.weapon={};
GC.weapon.bounceup={}; //when a weapon falls onto ground
GC.weapon.bounceup.limit= 8; //defined limit to bounce up again
GC.weapon.bounceup.speed={};
GC.weapon.bounceup.speed.y= -3.7; //defined bounce up speed
GC.weapon.bounceup.speed.x= 3;
GC.weapon.bounceup.speed.z= 1.5;
GC.weapon.soft_bounceup={}; //when heavy weapon being hit by character punch
GC.weapon.soft_bounceup.speed={};
GC.weapon.soft_bounceup.speed.y= -2;

GC.weapon.hit={}; //when a weapon hit others
GC.weapon.hit.vx= -3; //absolute speed
GC.weapon.hit.vy= 0;

GC.weapon.reverse={}; //when a weapon is being hit while travelling in air
GC.weapon.reverse.factor={};
GC.weapon.reverse.factor.vx= -0.4;
GC.weapon.reverse.factor.vy= -2;
GC.weapon.reverse.factor.vz= -0.4;

GC.combo={};
GC.combo.timeout=10; //how many TUs a combo will still be effective after being fired

GC.unspecified= -842150451; //0xCDCDCDCD, one kind of HEX label

return G;
});

/*\
 * network: p2p networking
 * wrapping functionality of F.core/network, enabling a (nearly) transparent interface for keyboard controlled games
\*/

define('F.core/network',['F.core/network'],function(Fnetwork)
{
	//local[i] in peer A will be mapped to remote[i] in peer B
	var local = [],
		remote = [];
	
	var verify, packet, callback;
	function set_interval(cb,int)
	{
		verify = {};
		packet = {control:[]};
		callback = cb;
		return Fnetwork.setInterval(frame,int);
	}
	function clear_interval(t)
	{
		Fnetwork.clearInterval(t);
		verify = packet = callback = null;
	}
	function frame(time,data,send)
	{
		if( data && data.control)
			for (var i=0; i<remote.length; i++)
				remote[i].supply(data.control[i]);
		for (var i=0; i<local.length; i++)
			packet.control[i] = local[i].pre_fetch();
		packet.verify = verify.last;
		send(packet);
		compare(verify.last_last,data && data.verify);
		verify.last_last = verify.last;
		verify.last = callback();
		for (var i=0; i<local.length; i++)
			local[i].swap_buffer();
		if( packet)
			packet.control.length = 0;
	}
	function compare(A,B)
	{
		if( A===undefined || B===undefined)
			return;
		for( var I in A)
		{
			if( !same(A[I],B[I]))
			{
				if( !verify.error)
				{
					alert('synchronization error');
					console.log(A,B);
					verify.error = true;
				}
			}
		}
		function same(a,b)
		{
			if( typeof a!==typeof b)
				return false;
			if( typeof a==='object')
			{
				for( var i in a)
					if( a[i]!==b[i])
						return false;
				return true;
			}
			else
				return a===b;
		}
	}
	
	function ncon(role,control)
	{
		this.state={};
		this.child=[];
		this.buf=[];
		this.pre_buf=[];
		this.sync=true;
		this.role=role;
		if( role==='local' || role==='dual')
		{
			local.push(this);
			this.control = control;
			this.type = control.type;
			if( control.config)
				this.config = control.config;
			if( control.keycode)
				this.keycode = control.keycode;
			control.child.push(this);
			control.sync=true;
			for( var i in control.state)
				this.state[i] = 0;
		}
		if( role==='remote' || role==='dual')
		{
			remote.push(this);
			if( role==='remote')
				for( var i in control)
					this.state[i] = 0;
		}
	}
	ncon.prototype.clear_states=function()
	{
	}
	ncon.prototype.flush=function()
	{
	}
	ncon.prototype.pre_fetch=function()
	{
		//here we pre-fetch a controller and put the key sequence into a buffer
		//  the buffer will then be sent off to a remote peer
		//locally, the buffer will be fetched at the next frame
		if( this.role==='local' || this.role==='dual')
		{
			this.control.fetch();
			return this.pre_buf;
		}
	}
	ncon.prototype.swap_buffer=function()
	{
		if( this.role==='local' || this.role==='dual')
		{
			var hold = this.pre_buf;
			this.pre_buf = this.buf;
			this.buf = hold;
			this.pre_buf.length=0;
		}
	}
	ncon.prototype.supply=function(buf)
	{
		//received a key sequence buffer from remote peer
		if( this.role==='remote' || this.role==='dual')
		{
			if( buf && buf.length)
				this.buf = this.buf.concat(buf);
		}
	}
	ncon.prototype.fetch=function()
	{
		for( var i=0; i<this.buf.length; i++)
		{
			var I=this.buf[i], K=I[0], D=I[1];
			for( var j=0; j<this.child.length; j++)
				this.child[j].key(K,D);
			this.state[K]=D;
		}
		this.buf.length=0;
	}
	ncon.prototype.key=function(K,down)
	{
		this.pre_buf.push([K,down]);
	}
	
	function setup(config)
	{
		if( config.monitor || config.success)
			Fnetwork.config({
				monitor:config.monitor,
				success:config.success
			});
		network.setInterval = set_interval;
		network.clearInterval = clear_interval;
		network.messenger = Fnetwork.messenger;
		if( config.transport.layer==='peerjs')
		{
			requirejs(['LFrelease/third_party/peer'],_setup);
		}
		else
		{
			setTimeout(_setup,1);
		}
		function _setup()
		{
			Fnetwork.setup_peer(
				config.transport.layer,
				config.transport.host,
				config.transport.key,
				config.role==='active',
				config.id1,
				config.id2
			);
		}
	}
	
	var network = {
		setup:setup,
		controller:ncon,
		setInterval:function(a,b){return setInterval(a,b);},
		clearInterval:function(a){return clearInterval(a);}
	}
	return network;
	
});

/*\
 * network: p2p networking
 * wrapping functionality of F.core/network, enabling a (nearly) transparent interface for keyboard controlled games
\*/

define('LF/network',['F.core/network'],function(Fnetwork)
{
	//local[i] in peer A will be mapped to remote[i] in peer B
	var local = [],
		remote = [];
	
	var verify, packet, callback;
	function set_interval(cb,int)
	{
		verify = {};
		packet = {control:[]};
		callback = cb;
		return Fnetwork.setInterval(frame,int);
	}
	function clear_interval(t)
	{
		Fnetwork.clearInterval(t);
		verify = packet = callback = null;
	}
	function frame(time,data,send)
	{
		if( data && data.control)
			for (var i=0; i<remote.length; i++)
				remote[i].supply(data.control[i]);
		for (var i=0; i<local.length; i++)
			packet.control[i] = local[i].pre_fetch();
		packet.verify = verify.last;
		send(packet);
		compare(verify.last_last,data && data.verify);
		verify.last_last = verify.last;
		verify.last = callback();
		for (var i=0; i<local.length; i++)
			local[i].swap_buffer();
		if( packet)
			packet.control.length = 0;
	}
	function compare(A,B)
	{
		if( A===undefined || B===undefined)
			return;
		for( var I in A)
		{
			if( !same(A[I],B[I]))
			{
				if( !verify.error)
				{
					alert('synchronization error');
					console.log(A,B);
					verify.error = true;
				}
			}
		}
		function same(a,b)
		{
			if( typeof a!==typeof b)
				return false;
			if( typeof a==='object')
			{
				for( var i in a)
					if( a[i]!==b[i])
						return false;
				return true;
			}
			else
				return a===b;
		}
	}
	
	function ncon(role,control)
	{
		this.state={};
		this.child=[];
		this.buf=[];
		this.pre_buf=[];
		this.sync=true;
		this.role=role;
		if( role==='local' || role==='dual')
		{
			local.push(this);
			this.control = control;
			this.type = control.type;
			if( control.config)
				this.config = control.config;
			if( control.keycode)
				this.keycode = control.keycode;
			control.child.push(this);
			control.sync=true;
			for( var i in control.state)
				this.state[i] = 0;
		}
		if( role==='remote' || role==='dual')
		{
			remote.push(this);
			if( role==='remote')
				for( var i in control)
					this.state[i] = 0;
		}
	}
	ncon.prototype.clear_states=function()
	{
	}
	ncon.prototype.flush=function()
	{
	}
	ncon.prototype.pre_fetch=function()
	{
		//here we pre-fetch a controller and put the key sequence into a buffer
		//  the buffer will then be sent off to a remote peer
		//locally, the buffer will be fetched at the next frame
		if( this.role==='local' || this.role==='dual')
		{
			this.control.fetch();
			return this.pre_buf;
		}
	}
	ncon.prototype.swap_buffer=function()
	{
		if( this.role==='local' || this.role==='dual')
		{
			var hold = this.pre_buf;
			this.pre_buf = this.buf;
			this.buf = hold;
			this.pre_buf.length=0;
		}
	}
	ncon.prototype.supply=function(buf)
	{
		//received a key sequence buffer from remote peer
		if( this.role==='remote' || this.role==='dual')
		{
			if( buf && buf.length)
				this.buf = this.buf.concat(buf);
		}
	}
	ncon.prototype.fetch=function()
	{
		for( var i=0; i<this.buf.length; i++)
		{
			var I=this.buf[i], K=I[0], D=I[1];
			for( var j=0; j<this.child.length; j++)
				this.child[j].key(K,D);
			this.state[K]=D;
		}
		this.buf.length=0;
	}
	ncon.prototype.key=function(K,down)
	{
		this.pre_buf.push([K,down]);
	}
	
	function setup(config)
	{
		if( config.monitor || config.success)
			Fnetwork.config({
				monitor:config.monitor,
				success:config.success
			});
		network.setInterval = set_interval;
		network.clearInterval = clear_interval;
		network.messenger = Fnetwork.messenger;
		if( config.transport.layer==='peerjs')
		{
			requirejs(['LFrelease/third_party/peer'],_setup);
		}
		else
		{
			setTimeout(_setup,1);
		}
		function _setup()
		{
			Fnetwork.setup_peer(
				config.transport.layer,
				config.transport.host,
				config.transport.key,
				config.role==='active',
				config.id1,
				config.id2
			);
		}
	}
	
	var network = {
		setup:setup,
		controller:ncon,
		setInterval:function(a,b){return setInterval(a,b);},
		clearInterval:function(a){return clearInterval(a);}
	}
	return network;
	
});

/*\
 * effect_pool
 * an effects pool manages a pool of effect instances using a circular array.
 * - each `effect` instance have the same life time, starting by `born` and end upon `die`.
 * - effect that born earlier should always die earlier
 * - when the pool is full, it can optionally expands
 * 
 * this is particularly useful in creating game effects.
 * say, you have an explosion visual effect that would be created 30 times per second
 * , that frequent object constructions create an overhead.
 * 
 * - effect class should have methods `born` and `die`
 * - each effect instance will be injected a `parent` property
 *  which is a reference to the containing effects pool,
 *  so that an instance can die spontaneously
\*/

define('F.core/effects-pool',[],function()
{
/*\
 * effect_pool
 [ class ]
 - config (object)
 * {
 -  init_size (number)
 -  batch_size (number)
 -  max_size (number)
 -  construct (function) should return newly created instances of effect
 * }
 | var ef_config=
 | {
 | 	init_size: 5,
 | 	batch_size: 5,
 | 	max_size: 100,
 | 	construct: function()
 | 	{
 | 		return new box_effect(1);
 | 	}
 | };
 | var effects = new Effects_pool(ef_config);
 * [example](../sample/effects-pool.html)
 # <iframe src="../sample/effects-pool.html" width="800" height="100"></iframe>
\*/
function efpool(config)
{
	this.pool=[]; //let it be a circular pool
	this.S=0; //start pivot
	this.E=0; //end pivot
	this.full=false;
	this.config=config;
	this.livecount=0;

	if( config.new_arg)
	{
		if( config.new_arg instanceof Array)
			this.new_arg = config.new_arg;
		else
			this.new_arg = [config.new_arg];
	}
	else
		this.new_arg = [];

	for( var i=0; i<config.init_size; i++)
	{
		this.pool[i] = config.construct();
		this.pool[i].parent = this;
	}
}

/*\
 * effect_pool.create
 [ method ]
 * activate an effect by calling `born`
 - arg (any) args will be passed through to `born`
 = (boolean) false if not okay
 = (object) reference to the new born effect if okay
 > Details
 * if the pool is full (all instances of effects are active) and __after__ expanding
 * the size is still smaller than or equal to `config.max_size`,
 * will expand the pool by size `config.batch_size`
 * 
 * if the pool is full and not allowed to expand, return false immediately
\*/
efpool.prototype.create=function(/*arg*/) //arguments will be passed through
{
	if( this.full)
	{
		if( this.pool.length + this.config.batch_size <= this.config.max_size)
		{	//expand the pool
			//console.log('expanding the pool');
			var args=[ this.E, 0];
			for( var i=0; i<this.config.batch_size; i++)
			{
				args[i+2] = this.config.construct();
				args[i+2].parent = this;
			}
			this.pool.splice.apply( this.pool, args);
			if( this.S!==0)
				this.S += this.config.batch_size;
			this.full=false;
		}
		else
			return false;
	}

	if( this.E < this.pool.length)
		this.E++;
	else
		this.E=1;

	if( this.E === this.S || (this.S===0 && this.E===this.pool.length))
	{
		//console.log('effects pool full');
		this.full=true;
	}

	if( this.pool[this.E-1].born)
		this.pool[this.E-1].born.apply ( this.pool[this.E-1], arguments);

	this.livecount++;
	return this.pool[this.E-1];
}

/*\
 * effect_pool.die
 [ method ]
 * deactivate the oldest effect instance by calling `die`
 - arg (any) args will be passed through to `die`
 = (object) a reference to the instance that died
 = (undefined) if there is actually no active effect
\*/
efpool.prototype.die=function(/*arg*/) //arguments will be passed through
{
	if( this.livecount > 0)
	{
		var oldS=this.S;
		if( this.pool[this.S].die)
			this.pool[this.S].die.apply ( this.pool[this.S], arguments);

		if( this.S < this.pool.length-1)
			this.S++;
		else
			this.S=0;

		this.full = false;
		this.livecount--;
		return this.pool[oldS];
	}
	else
		console.log('die too much!');
}

/*\
 * effect_pool.for_each
 [ method ]
 * iterate through all active instances, in the order of oldest to youngest
 - fun (function) iterator function, if return value is 'break', will break the loop
| efpool.for_each(function(e)
| {
|		e.hi();
| })
\*/
efpool.prototype.for_each=function(fun)
{
	if( this.livecount===0)
	{
		//completely empty
	}
	else if( this.S < this.E)
	{
		//  _ _S_ _E_
		// |_|_|*|*|_|
		for ( var i=this.S; i<this.E; i++)
			if( fun( this.pool[i])==='break')
				break;
	}
	else
	{
		//  _ _E_ _S_
		// |*|*|_|_|*|
		for ( var j=this.S; j<this.pool.length; j++)
			if( fun( this.pool[j])==='break')
				return ;
		for ( var i=0; i<this.E; i++)
			if( fun( this.pool[i])==='break')
				return ;
	}
}

/*\
 * effect_pool.call_each
 [ method ]
 * call a method of each active instance, in the order of oldest to youngest
 - fun_name (string) method name
 - arg (any) extra args will be passed through
\*/
efpool.prototype.call_each=function(fun_name /*, arg*/)
{
	if( this.pool[0][fun_name])
	{
		var arg= Array.prototype.slice.call(arguments,1);
		this.for_each(function(ef)
		{
			ef[fun_name].apply(ef, arg);
		});
	}
}

return efpool;
});

/*\
 * soundpack
 * sound spriting and effects management
\*/

define('LF/soundpack',['F.core/effects-pool'],function(Feffects)
{
	var basic_support = !!(document.createElement('audio').canPlayType);
	
	function soundmanager(config)
	{
		if( !config || !basic_support)
			return { //dummy object
				play:function(){},
				TU:function(){},
				dummy:true
			}
		this.packs = {};
		this.buffer = {};
		this.time = 0;
		var This = this;
		for( var i=0; i<config.packs.length; i++)
			(function(i){
				This.packs[config.packs[i].id] = new Feffects({
					circular: false,
					init_size: 5,
					batch_size: 5,
					max_size: 15,
					construct: function()
					{
						return new soundsprite(config.packs[i].data,config.resourcemap);
					}
				});
			}(i));
	}
	soundmanager.prototype.play=function(path)
	{
		if( this.buffer[path])
			return; //play each sound once only in one TU
		this.buffer[path] = true;
		var I, id;
		if( path.charAt(1)==='/')
		{
			I = path.charAt(0);
			id = path.slice(2);
		}
		else
		{
			var str = path.split('/');
			I = str[0];
			id = str[1];
		}
		if( this.packs[I])
			this.packs[I].create(id);
	}
	soundmanager.prototype.TU=function()
	{
		this.time++;
		if( this.time%5===0)
			for( var I in this.buffer) //clear buffer
				this.buffer[I] = null;
	}
	soundmanager.support=function(callback)
	{
		if( !basic_support)
			return;
		var src = {
			mp3:'data:audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
			ogg:'data:audio/ogg;base64,T2dnUwACAAAAAAAAAADqnjMlAAAAAOyyzPIBHgF2b3JiaXMAAAAAAUAfAABAHwAAQB8AAEAfAACZAU9nZ1MAAAAAAAAAAAAA6p4zJQEAAAANJGeqCj3//////////5ADdm9yYmlzLQAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMTAxMTAxIChTY2hhdWZlbnVnZ2V0KQAAAAABBXZvcmJpcw9CQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBACAAAAYRqF1TCqDEEPKQ4QUY9AzoxBDDEzGHGNONKQMMogzxZAyiFssLqgQBKEhKwKAKAAAwBjEGGIMOeekZFIi55iUTkoDnaPUUcoolRRLjBmlEluJMYLOUeooZZRCjKXFjFKJscRUAABAgAMAQICFUGjIigAgCgCAMAYphZRCjCnmFHOIMeUcgwwxxiBkzinoGJNOSuWck85JiRhjzjEHlXNOSuekctBJyaQTAAAQ4AAAEGAhFBqyIgCIEwAwSJKmWZomipamiaJniqrqiaKqWp5nmp5pqqpnmqpqqqrrmqrqypbnmaZnmqrqmaaqiqbquqaquq6nqrZsuqoum65q267s+rZru77uqapsm6or66bqyrrqyrbuurbtS56nqqKquq5nqq6ruq5uq65r25pqyq6purJtuq4tu7Js664s67pmqq5suqotm64s667s2rYqy7ovuq5uq7Ks+6os+75s67ru2rrwi65r66os674qy74x27bwy7ouHJMnqqqnqq7rmarrqq5r26rr2rqmmq5suq4tm6or26os67Yry7aumaosm64r26bryrIqy77vyrJui67r66Ys67oqy8Lu6roxzLat+6Lr6roqy7qvyrKuu7ru+7JuC7umqrpuyrKvm7Ks+7auC8us27oxuq7vq7It/KosC7+u+8Iy6z5jdF1fV21ZGFbZ9n3d95Vj1nVhWW1b+V1bZ7y+bgy7bvzKrQvLstq2scy6rSyvrxvDLux8W/iVmqratum6um7Ksq/Lui60dd1XRtf1fdW2fV+VZd+3hV9pG8OwjK6r+6os68Jry8ov67qw7MIvLKttK7+r68ow27qw3L6wLL/uC8uq277v6rrStXVluX2fsSu38QsAABhwAAAIMKEMFBqyIgCIEwBAEHIOKQahYgpCCKGkEEIqFWNSMuakZM5JKaWUFEpJrWJMSuaclMwxKaGUlkopqYRSWiqlxBRKaS2l1mJKqcVQSmulpNZKSa2llGJMrcUYMSYlc05K5pyUklJrJZXWMucoZQ5K6iCklEoqraTUYuacpA46Kx2E1EoqMZWUYgupxFZKaq2kFGMrMdXUWo4hpRhLSrGVlFptMdXWWqs1YkxK5pyUzDkqJaXWSiqtZc5J6iC01DkoqaTUYiopxco5SR2ElDLIqJSUWiupxBJSia20FGMpqcXUYq4pxRZDSS2WlFosqcTWYoy1tVRTJ6XFklKMJZUYW6y5ttZqDKXEVkqLsaSUW2sx1xZjjqGkFksrsZWUWmy15dhayzW1VGNKrdYWY40x5ZRrrT2n1mJNMdXaWqy51ZZbzLXnTkprpZQWS0oxttZijTHmHEppraQUWykpxtZara3FXEMpsZXSWiypxNhirLXFVmNqrcYWW62ltVprrb3GVlsurdXcYqw9tZRrrLXmWFNtBQAADDgAAASYUAYKDVkJAEQBAADGMMYYhEYpx5yT0ijlnHNSKucghJBS5hyEEFLKnINQSkuZcxBKSSmUklJqrYVSUmqttQIAAAocAAACbNCUWByg0JCVAEAqAIDBcTRNFFXVdX1fsSxRVFXXlW3jVyxNFFVVdm1b+DVRVFXXtW3bFn5NFFVVdmXZtoWiqrqybduybgvDqKqua9uybeuorqvbuq3bui9UXVmWbVu3dR3XtnXd9nVd+Bmzbeu2buu+8CMMR9/4IeTj+3RCCAAAT3AAACqwYXWEk6KxwEJDVgIAGQAAgDFKGYUYM0gxphhjTDHGmAAAgAEHAIAAE8pAoSErAoAoAADAOeecc84555xzzjnnnHPOOeecc44xxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY0wAwE6EA8BOhIVQaMhKACAcAABACCEpKaWUUkoRU85BSSmllFKqFIOMSkoppZRSpBR1lFJKKaWUIqWgpJJSSimllElJKaWUUkoppYw6SimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaVUSimllFJKKaWUUkoppRQAYPLgAACVYOMMK0lnhaPBhYasBAByAwAAhRiDEEJpraRUUkolVc5BKCWUlEpKKZWUUqqYgxBKKqmlklJKKbXSQSihlFBKKSWUUkooJYQQSgmhlFRCK6mEUkoHoYQSQimhhFRKKSWUzkEoIYUOQkmllNRCSB10VFIpIZVSSiklpZQ6CKGUklJLLZVSWkqpdBJSKamV1FJqqbWSUgmhpFZKSSWl0lpJJbUSSkklpZRSSymFVFJJJYSSUioltZZaSqm11lJIqZWUUkqppdRSSiWlkEpKqZSSUmollZRSaiGVlEpJKaTUSimlpFRCSamlUlpKLbWUSkmptFRSSaWUlEpJKaVSSksppRJKSqmllFpJKYWSUkoplZJSSyW1VEoKJaWUUkmptJRSSymVklIBAEAHDgAAAUZUWoidZlx5BI4oZJiAAgAAQABAgAkgMEBQMApBgDACAQAAAADAAAAfAABHARAR0ZzBAUKCwgJDg8MDAAAAAAAAAAAAAACAT2dnUwAEAAAAAAAAAADqnjMlAgAAADzQPmcBAQA='
		};
		try {
			var audio = document.createElement('audio');
			for( var I in src)
			{
				var source = document.createElement('source');
				source.src = src[I];
				audio.appendChild(source);
			}
			audio.autoplay = true;
			audio.addEventListener('play',function onplay(){
				audio.removeEventListener('play',onplay,true);
				audio.pause();
				callback({autoplay:true});
			},true);
		} catch(e) {
		}
	}
	
	var types=
	{
		'mp3': 'audio/mpeg',
		'ogg': 'audio/ogg',
		'wav': 'audio/wav',
		'aac': 'audio/aac',
		'm4a': 'audio/x-m4a'
	};
	function soundsprite(data,resourcemap)
	{
		var This = this;
		var audio = this.audio = document.createElement('audio');
		this.frame = data.sound;
		audio.preload='auto';
		for( var i=0; i<data.ext.length; i++)
		{
			var source = document.createElement('source');
			var src = data.file+'.'+data.ext[i];
			if( resourcemap)
				src = resourcemap.get(src);
			source.src = src;
			if( types[data.ext[i]])
				source.type = types[data.ext[i]];
			audio.appendChild(source);
		}
		audio.addEventListener('timeupdate',function(){This.timeupdate();},true);
		this.die();
	}
	soundsprite.prototype.born=function(id)
	{
		if( id && this.frame[id])
		{
			this.current = this.frame[id];
			if( this.audio.readyState>=4)
			{
				this.audio.currentTime = this.current.start;
				this.audio.play();
			}
			this.paused = false;
		}
		else this.parent.die(this);
	}
	soundsprite.prototype.die=function(id)
	{
		this.audio.pause();
		this.paused = true;
	}
	soundsprite.prototype.timeupdate=function()
	{
		if( this.current && !this.paused)
		{
			if( this.audio.currentTime < this.current.start ||
				this.audio.currentTime > this.current.end)
				this.parent.die(this);
		}
	}
	
	return soundmanager;
});

/*\
 * util
 * javascript utilities
\*/
define('F.core/util',[],function(){

var F={

// javascript-----------------

/**	inject a .js file
	deprecated in favour of the use of head.js, now requirejs
*/
/* js: function (filename)
{
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.src = filename;
	script.type = 'text/javascript';
	head.appendChild(script);
}, */

/*\
 * util.css
 * attach a stylesheet to page
 [ method ]
 - filename (string)
\*/
css: function (filename)
{
	var head = document.getElementsByTagName('head')[0];
	var link = document.createElement('link');
	link.href = filename;
	link.rel = 'stylesheet';
	link.type = 'text/css';
	head.appendChild(link);
},

/**
 * util.double_delegate
 * double delegate a function
 [ method ]
 * [reference](http://roberthahn.ca/articles/2007/02/02/how-to-use-window-onload-the-right-way/)
 */
double_delegate: function (function1, function2)
{
	return function() {
	if (function1)
		function1.apply(this,Array.prototype.slice.call(arguments));
	if (function2)
		function2.apply(this,Array.prototype.slice.call(arguments));
	}
},

/*\
 * util.make_array
 [ method ]
 - target (any)
 * if target is:
 - (array) returns target as is.
 - (object) returns object encapsulated in an array.
 - (falsy) (null, undefined or zero), returns an empty array.
\*/
make_array: function (target)
{
	if( target)
	{
		if( target instanceof Array)
			return target;
		else
			return [target];
	}
	else
		return [];
},

//data structure------------

/*\
 * util.search_array
 [ method ]
 - arr (array) target to be searched
 - fc_criteria (function) return true when an accepted element is passed in
 - [fc_replace] (function) to return a replacement value when original value is passed in
 - [search_all] (boolean) if true, will search through entire array before returning the list of indices, otherwise, will return immediately at the first accepted element
 = (number) index of the found element if `search_all` if false
 = (array) of (number) if `search_all` is true
\*/
search_array: function (arr, fc_criteria, fc_replace, search_all)
{
	var found_list=new Array();
	//for ( var i=0; i<arr.length; i++)
	for ( var i in arr)
	{
		if ( fc_criteria(arr[i],i))
		{
			if ( fc_replace) {
				arr[i] = fc_replace(arr[i]);
			}
			if ( !search_all) {
				return i;
			} else {
				found_list.push(i);
			}
		}
	}
	if ( search_all) {
		return found_list;
	} else {
		return -1;
	}
},
arr_search: function (A,B,C,D)
{
	return F.search_array(A,B,C,D);
},

/*\
 * util.push_unique
 * push only if not existed in array
 [ method ]
 - array (array)
 - element (object)
 = (boolean) true if added
\*/
push_unique: function ( array, element)
{
	var res = F.arr_search( array, function(E){return E==element} );
	if (res == -1)
	{
		array.push(element);
		return true;
	}
},

/*\
 * util.extend_object
 * extend obj1 with all members of obj2
 [ method ]
 - obj1, obj2 (object)
 = (object) a modified obj1
\*/
extend_object: function (obj1, obj2)
{
	for (var p in obj2)
	{
		if ( typeof obj2[p]=='object' )
		{
			obj1[p] = arguments.callee((obj1[p]?obj1[p]:{}), obj2[p]);
		} else
		{
			obj1[p] = obj2[p];
		}
	}
	return obj1;
	// http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
},

/*\
 * util.to_text
 * convert an object into JSON text
 * 
 * most of the time you should use built-in `JSON.stringify` instead
 [ method ]
 - obj (object)
 - name (string) the object's name
 - [sep] (string) separator, default as `\n`
 - [pretext] (string) used in recursion only, set it to null
 - [filter] (function) a filter `function(p,P)` passing in name p and object P, return 1 to hide the attribute, OR return a string to be shown
 - [TTL] (number) time-to-live to prevent infinite looping
|	var obj={};
|	obj.a={};
|	obj.a.x=1;
|	obj.a.y=1;
|	obj.b='hello';
|	obj.c=12;
|	console.log(util.to_text(obj,'obj'));
|	//outputs:
|	obj:
|	{
|		a:
|		{
|			'x': 1,
|			'y': 1
|		},
|		'b': 'hello',
|		'c': 12
|	}
\*/
to_text: function (
	obj2, name,
	sep,
	pretext,
	filter,
	TTL
)
{
	if( TTL===0) return '';
	if( !TTL) TTL=30;
	if( !sep) sep='\n';
	if( !pretext) pretext='';

	var str = pretext+ name +':'+sep;
	str+= pretext+ '{';
	var cc=0;
	for (var p in obj2)
	{
		var fil = filter && filter(p,obj2[p]);
		if( fil==1)
		{
			//do nothing
		}
		else if( typeof fil=='string')
		{
			str += (cc?',':'')+sep+pretext+'\t'+"'"+p+"'"+': '+fil;
		}
		else
		{
			if( obj2[p].constructor==Object )
			{
				str += (cc?',':'')+sep+arguments.callee(obj2[p],p,sep,pretext+'\t',filter,TTL-1);
			} else
			{
				str += (cc?',':'')+sep+pretext+'\t'+"'"+p+"'"+': ';
				if( typeof obj2[p]=='string')
					str += "'";
				str += obj2[p];
				if( typeof obj2[p]=='string')
					str += "'";
			}
		}
		cc=1;
	}
	str+= sep+pretext+ '}';
	return str;
},

/*\
 * util.extract_array
 [ method ]
 * extract properties from an array of objects
|	//say we have
|	[ {x:x1,y:y1}, {x:x2,y:y2}, {x:x3,y:y3},,,]
|	//we want to extract it into
|	{
|	  x:
|		[ x1, x2, x3,,, ],
|	  y:
|		[ y1, y2, y3,,, ]
|	}
 - array (array)
 - prop (string) property name
 * or
 - prop (array) array of property name
 = (array) extracted array
\*/
extract_array: function(array, prop)
{
	var out={};
	prop = F.make_array(prop);

	for( var j in prop)
		out[prop[j]] = [];

	for( var i=0; i<array.length; i++)
	{
		for( var k=0; k<prop.length; k++)
		{
			var P=prop[k];
			out[P].push(array[i][P]);
		}
	}
	return out;
},

/** proposed method
group an array of objects using a key
group_elements( [{name:'alice',gender:'F'},{name:'bob',gender:'M'},{name:'cathy',gender:'F'}], 'gender')
returns
{
	'F':[{name:'alice',gender:'F'},{name:'cathy',gender:'F'}],
	'M':[{name:'bob',gender:'M'}]
}
*/
group_elements: function(arr,key)
{
	var group={};
	for( var i=0; i<arr.length; i++)
	{
		var gp=arr[i][key];
		if( !group[gp])
			group[gp]=[];
		group[gp].push(arr[i]);
	}
	return group;
},

/** proposed method*/
for_each: function(arr,callback)
{
	if( arr instanceof Array)
	{
		for( var i=0; i<arr.length; i++)
			callback(arr[i],i);
	}
	else if( arr)
	{
		for( var I in arr)
			callback(arr[I]);
	}
},

/** proposed method*/
call_each: function(arr,method /*,arg*/)
{
	var arg = Array.prototype.slice.call(arguments,2);
	if( arr instanceof Array)
	{
		for( var i=0; i<arr.length; i++)
			if( typeof arr[i][method]==='function')
				arr[i][method].apply(null, arg);
	}
	else if( arr)
	{
		for( var i in arr)
			if( typeof arr[i][method]==='function')
				arr[i][method].apply(null, arg);
	}
}

};

return F;
});

define('F.core/controller',[],function()
{

function keydown(e)
{
	return master_controller.key(e,1);
}

function keyup(e)
{
	return master_controller.key(e,0);
}

//block F1 key in IE
if( 'onhelp' in window)
{
	window.onhelp = function(){
		return false;
	}
}

var master_controller = (function()
{
	if (document.addEventListener){
		document.addEventListener("keydown", keydown, true);
		document.addEventListener("keyup", keyup, true);
	} else if (document.attachEvent){
		document.attachEvent("keydown", keydown);
		document.attachEvent("keyup", keyup);
	} else {
		//window.onkeydown = F.double_delegate(window.onkeydown, keydown);
		//window.onkeyup   = F.double_delegate(window.onkeydown, keyup);
	}

	var mas = new Object();
	mas.child = [];
	mas.key = function(e,down)
	{
		if (!e) e = window.event;
		for (var I in this.child)
		{
			if ( this.child[I].key(e.keyCode,down))
				break;//if one controller catches a key, the next controller will never receive an event
		}
		//the follow section blocks some browser-native key events, including ctrl+f and F1~F12
		e.cancelBubble = true;
		e.returnValue = false;
		if (e.stopPropagation)
		{
			e.stopPropagation();
			e.preventDefault();
		}
		return false;
	}
	return mas;
}());

/*\
 * controller
 * keyboard controller
 * - controllers for multiple players on the same keyboard
 * - maintains a table of key states
 * - generate key events for child controllers
 * - buffered mode: buffer inputs and fetch only once a loop
 * - never drops keys
 * see [http://project--f.blogspot.hk/2012/11/keyboard-controller.html](http://project--f.blogspot.hk/2012/11/keyboard-controller.html) for technical explaination
 [ class ]
 - config (object)
|	var con_config=
|	{
|		up:'h',down:'n',left:'b',right:'m',def:'v',jump:'f',att:'d'
|		//,'control name':'control key',,,
|	}
|	var con = new controller(con_config);
\*/
function controller (config)
{
	/*\
	 * controller.state
	 [ property ]
	 - (object)
	 * table of key states
	 * 
	 * note that keys are indexed by their names, i.e. `up`,`down` rather than `w`,`s`
	 | con.state.down //check if the `down` key is pressed down
	\*/
	this.state={};
	/*\
	 * controller.config
	 [ property ]
	 - (object)
	 * note that controller still keeps a reference to the config object
	\*/
	this.config=config;
	/*\
	 * controller.keycode
	 [ property ]
	 - (object)
	 * the keycode for each key
	\*/
	this.keycode={};
	/*\
	 * controller.child
	 [ property ]
	 * child systems that has the method `key(name,down)`
	 *
	 * push a child into this array to listen to key events
	 *
	 * see @combodec.key
	\*/
	this.child=new Array();
	/*\
	 * controller.sync
	 * controllers can work in 2 modes, sync and async
	 [ property ]
	 * if `sync===false`, a key up-down event will be dispatched to all child **immediately**.
	 * 
	 * if `sync===true`, a key up-down event will be buffered, and must be `fetch` manually.
	 * there are very good reasons to architect your game in synchronous mode
	 * - time-determinism; see [http://project--f.blogspot.hk/2013/04/time-model-and-determinism.html](http://project--f.blogspot.hk/2013/04/time-model-and-determinism.html)
	 * - never drop keys; see [http://project--f.blogspot.hk/2012/11/keyboard-controller.html](http://project--f.blogspot.hk/2012/11/keyboard-controller.html)
	\*/
	this.sync=false;
	/*\
	 * controller.buf
	 [ property ]
	 - (array)
	 * the array of keyname of buffered key input
	\*/
	this.buf=new Array();

	//[--constructor
	master_controller.child.push(this);
	this.clear_states();
	for(var I in this.config)
	{
		this.keycode[I] = controller.keyname_to_keycode(this.config[I]);
	}
	//--]

	/*\
	 * controller.zppendix
	 * on the other hand, there can be other controllers with compatible definition and behavior,
	 * (e.g. AI controller, network player controller, record playback controller)
	 * - has the properties `state`, `config`, `child`, `sync`
	 * - behavior: call the `key` method of every member of `child` when keys arrive
	 * - has the method `clear_states`, `fetch` and `flush`
	 * - behavior: if `sync` is true, the controller should buffer key inputs,
	 * and only dispatch to child when `fetch` is called,
	 * and flush the buffer when `flush` is called
	\*/
}


/*\
 * controller.key
 [ method ]
 * supply events to controller
 * 
 * master controller will do this automatically
 - e (object) keycode
 - down (boolean)
\*/
controller.prototype.key=function(e,down) //interface to master_controller
{
	var caught=0;
	for(var I in this.config)
	{
		if ( this.keycode[I]==e)
		{
			if( this.sync===false)
			{
				if( this.child)
					for(var J in this.child)
						this.child[J].key(I,down);
				this.state[I]=down;
			}
			else
			{
				this.buf.push([I,down]);
			}
			caught=1;
			break;
		}
	}
	return caught;
}

/*\
 * controller.clear_states
 * clear the key state table
 [ method ]
\*/
controller.prototype.clear_states=function()
{
	for(var I in this.config)
		this.state[I]=0;
}
/*\
 * controller.fetch
 * fetch for inputs received since the last fetch, will flush buffer afterwards
 [ method ]
\*/
controller.prototype.fetch=function()
{
	for( var i in this.buf)
	{
		var I=this.buf[i][0];
		var down=this.buf[i][1];
		if( this.child)
			for(var J in this.child)
				this.child[J].key(I,down);
		this.state[I]=down;
	}
	this.buf=[];
}
/*\
 * controller.flush
 * flush the buffer manually
 [ method ]
\*/
controller.prototype.flush=function()
{
	this.buf=[];
}

/*\
 * controller.keyname_to_keycode
 * convert keyname to keycode
 [ method ]
 - keyname (string) 
 = (number) keycode 
 * note that some keycode is not the same across all browsers, 
 * for details consult [http://www.quirksmode.org/js/keys.html](http://www.quirksmode.org/js/keys.html)
\*/
controller.keyname_to_keycode=
controller.prototype.keyname_to_keycode=
function(A)
{
	var code;
	if( A.length==1)
	{
		var a=A.charCodeAt(0);
		if ( (a>='a'.charCodeAt(0) && a<='z'.charCodeAt(0)) || (a>='A'.charCodeAt(0) && a<='Z'.charCodeAt(0)) )
		{
			A=A.toUpperCase();
			code=A.charCodeAt(0);
		}
		else if (a>='0'.charCodeAt(0) && a<='9'.charCodeAt(0))
		{
			code=A.charCodeAt(0);
		}
		else
		{	//different browsers on different platforms are different for symbols
			switch(A)
			{
				case '`': code=192; break;
				case '-': code=189; break;
				case '=': code=187; break;
				case '[': code=219; break;
				case ']': code=221; break;
				case '\\': code=220; break;
				case ';': code=186; break;
				case "'": code=222; break;
				case ',': code=188; break;
				case '.': code=190; break;
				case '/': code=191; break;
				case ' ': code=32; break;
			}
		}
	}
	else
	{
		switch(A)
		{
			case 'ctrl': code=17; break;
			case 'up': code=38; break; //arrow keys
			case 'down': code=40; break;
			case 'left': code=37; break;
			case 'right': code=39; break;
			case 'space': code=32; break;
			case 'esc': code=27; break;
		}
	}
	if( A.length==2)
	{
		if( A.charAt(0)==='F')
		{
			code=111+parseInt(A.slice(1));
		}
	}
	return code;
}

/*\
 * controller.keycode_to_keyname
 * convert keycode back to keyname
 [ method ]
 - keycode (number) 
 = (string) keyname
\*/
controller.keycode_to_keyname=
controller.prototype.keycode_to_keyname=
function(code)
{
	if( (code>='A'.charCodeAt(0) && code<='Z'.charCodeAt(0)) ||
	    (code>='0'.charCodeAt(0) && code<='9'.charCodeAt(0)) )
	{
		return String.fromCharCode(code).toLowerCase();
	}
	else if( code>=112 && code<=123)
	{
		return 'F'+(code-111);
	}
	else
	{
		var nam = code;
		switch(code)
		{
			case 38: nam='up'; break;
			case 40: nam='down'; break;
			case 37: nam='left'; break;
			case 39: nam='right'; break;
			case 32: nam='space'; break;
			case 27: nam='esc'; break;
		}
		return nam;
	}
}

return controller;

// http://unixpapa.com/js/key.html
});

;
define("LF/sprite-select", function(){});

define('F.core/animator',[],function()
{

/*\
 * animator
 [ class ]
 * - animate sprites
 * - support multiple animation sequence on the same image
 - config (object)
| {
|		x:0,y:0,     //top left margin of the frames
|		w:100, h:100,//width, height of a frame
|		gx:4,gy:4,   //define a gx*gy grid of frames
|		tar:         //target @sprite
|		ani:         //[optional] animation sequence:
|			null,    //if undefined, loop through top left to lower right, row by row
|			[0,1,2,1,0],//use custom animation sequence
|		borderright: 1, //[optionals] trim the right edge pixels away
|		borderbottom: 1,
|		borderleft: 1,
|		bordertop: 1
| }
 * multiple animators reference to the same config, so dont play with it in runtime
 *
 * [example](../sample/sprite.html)
 # <iframe src="../sample/sprite.html" width="400" height="250"></iframe>
 # <img src="../sample/test_sprite.png" width="300">
\*/
function animator (config)
{
	this.config=config;
	this.target=config.tar;
	/*\
	 * animator.I
	 * current frame
	 [ property ]
	 * if `config.ani` exists, `I` is the index to this array. otherwise it is the frame number
	\*/
	this.I=0;
	/*\
	 * animator.horimirror
	 [ property ]
	 - (boolean) true: mirrored, false: normal
	 * usually a sprite character is drawn to face right and mirrored to face left. hmirror mode works with sprites that is flipped horizontally __as a whole image__.
	\*/
	this.horimirror=false; //horizontal mirror
	if( !config.borderright)  config.borderright=0;
	if( !config.borderbottom) config.borderbottom=0;
	if( !config.borderleft)  config.borderleft=0;
	if( !config.bordertop)   config.bordertop=0;
}
/*\
 * animator.next_frame
 * turn to the next frame
 [ method ]
 * if `config.ani` exists, will go to the next frame of animation sequence
 *
 * otherwise, loop through top left to lower right, row by row
 = (number) the frame just shown
 * remarks: if you want to check whether the animation is __ended__, test it against 0. when `animator.I` equals 'max frame index', the last frame is _just_ being shown. when `animator.I` equals 0, the last frame had finished the whole duration of a frame and is _just_ ended.
\*/
animator.prototype.next_frame=function()
{
	var c=this.config;
	this.I++;
	if (!c.ani)
	{
		if ( this.I==c.gx*c.gy)
		{
			this.I=0; //repeat sequence
		}
		this.show_frame(this.I);
	}
	else
	{
		var fi=c.ani[this.I];
		if ( this.I>=c.ani.length || this.I<0)
		{
			this.I=0; fi=c.ani[0]; //repeat sequence
		}
		this.show_frame(fi);
	}
	return this.I;
}
/*\
 * animator.seek
 * seek to a particular index on animation sequence
 [ method ]
 - I (number) sequence index
\*/
animator.prototype.seek=function(I)
{
	var c=this.config;
	if( c.ani)
	if( I>=0 && I<c.ani.length)
	{
		this.I=I;
		var fi=c.ani[this.I];
		this.show_frame(fi);
	}
}
/*\
 * animator.rewind
 [ method ]
 * return to the first frame of animation sequence
\*/
animator.prototype.rewind=function()
{
	this.I=-1;
	this.next_frame();
}
/*\
 * animator.set_frame
 [ method ]
 * set to a particular frame
 - i (number) frame number on image
 * the top-left frame is 0
\*/
animator.prototype.set_frame=function(i)
{
	this.I=i;
	this.show_frame(i);
}
animator.prototype.show_frame=function(i)
{
	var c=this.config;
	var left,top;
	left= -((i%c.gx)*c.w+c.x+c.borderleft);
	top = -((Math.floor(i/c.gx))*c.h+c.y+c.bordertop);
	if( this.horimirror)
		left= -this.target.img[this.target.cur_img].naturalWidth-left+c.w-c.borderleft-c.borderright;
	this.target.set_w_h(
		c.w-c.borderleft-c.borderright,
		c.h-c.bordertop-c.borderbottom
	);
	this.target.set_img_x_y(left,top);
	//may also need to set_x_y to compensate the border
}
animator.prototype.get_at=function(i) //get the content of the graph at frame i
{	//by default at the current frame
	if( !i) i=this.I;
	var c=this.config;
	return c.graph[(i%c.gx)][(Math.floor(i/c.gx))];
}

/*\
 * animator.set
 [ method ]
 * a helper function to constructor a set of animators
 *
 * animator set is a method. do **not** `var ani = new animator_set(..)`
 - set_config (object)
 - [base] (string)
 *
| set_config=
| {
|	'base': //default parameters, must be specified as base when calling animator_set
|	{
|		x:0,y:0,     //top left margin of the frames
|		w:L, h:L,    //width, height of a frame
|		gx:4,gy:1,   //define a gx*gy grid of frames
|		tar:null,    //target sprite
|	},
|
|	'standing':
|	{	//change only values you want to
|		x:0,y:0,     //top left margin of the frames
|		gx:4,gy:1    //define a gx*gy grid of frames
|	} //,,,
| }
| var set = animator.set(set_config,'base')
 = (object) animator set
\*/
animator.set=function(set_config, base)
{
	if(!set_config)
		return null;
	var A=new Object();

	for( var I in set_config)
	{
		if( base) if( I==base)
			continue;

		if( base) if( set_config[base])
		{
			for( var J in set_config[base])
				set_config[I][J] = set_config[base][J];
		}

		A[I]=new animator(set_config[I]);
	}
	return A;
}

return animator;

});

/*\
 * sprite
 * 
 * sprite-animator for LF2
\*/
define('LF/sprite',['LF/sprite-select','F.core/animator'], function (Fsprite, Fanimator)
{

/*\
 * sprite
 [ class ]
 - bmp (object) data structure as defined in data files
 - parent (DOM node) where to append the new sprite
\*/
function sprite (bmp, parent)
{
	/*\
	 * sprite.num_of_images
	 [ property ]
	\*/
	var num_of_images = this.num_of_images = bmp.file.length;
	/*\
	 * sprite.w
	 [ property ]
	 * width
	\*/
	/*\
	 * sprite.h
	 [ property ]
	 * height
	\*/
	var w = this.w = bmp.file[0].w+1;
	var h = this.h = bmp.file[0].h+1;
	/*\
	 * sprite.ani
	 [ property ]
	 - Fanimator (object)
	\*/
	var ani = this.ani = [];
	/*\
	 * sprite.dir
	 [ property ]
	 * `'left'` or `'right'`
	\*/
	this.dir = 'right';
	/*\
	 * sprite.cur_img
	 [ property ]
	 * current image index
	\*/
	this.cur_img = 0;

	var sp_con=
	{
		canvas: parent,
		wh: {w:w,h:h},
		img:{}
	}
	/*\
	 * sprite.sp
	 [ property ]
	 - Fsprite (object)
	\*/
	var sp = this.sp = new Fsprite(sp_con);

	for( var i=0; i<bmp.file.length; i++)
	{
		var imgpath='';
		for( var j in bmp.file[i])
		{
			if( typeof bmp.file[i][j] === 'string' &&
			    j.indexOf('file')===0 )
				imgpath = bmp.file[i][j];
		}
		if( imgpath==='')
			console.log( 'cannot find img path in data:\n'+JSON.stringify(bmp.file[i]) );
		sp.add_img( imgpath, i);

		var ani_con=
		{
			x:0,  y:0,   //top left margin of the frames
			w:bmp.file[i].w+1, h:bmp.file[i].h+1,    //width, height of a frame
			gx:bmp.file[i].row, gy:bmp.file[i].col,//define a gx*gy grid of frames
			tar:sp,     //target sprite
			borderleft: 0,
			bordertop: 0,
			borderright: 1,
			borderbottom: 1
		};
		ani.length++;
		ani[i] = new Fanimator(ani_con);
	}
}

/*\
 * sprite.destroy
 [ method ]
 * clear memory so that itself and the DOM nodes can be garbage collected
\*/
sprite.prototype.destroy = function()
{
	this.sp.remove();
	this.sp=null;
	this.ani.length=0;
}

/*\
 * sprite.show_pic
 [ method ]
 - I (number) picture index to show
\*/
sprite.prototype.show_pic = function(I)
{
	var slot=0;
	for( var k=0; k<this.ani.length; k++)
	{
		var i = I - this.ani[k].config.gx * this.ani[k].config.gy;
		if( i >= 0)
		{
			I = i;
			slot++;
		}
		else
			break;
	}
	if( slot >= this.ani.length)
	{
		slot = this.ani.length-1;
		I=999;
	}
	this.cur_img = slot;
	this.sp.switch_img(this.cur_img);
	this.ani[this.cur_img].set_frame(I);
	this.w = this.ani[this.cur_img].config.w;
	this.h = this.ani[this.cur_img].config.h;
}
/*\
 * sprite.switch_lr
 [ method ]
 * switch sprite direction
 - dir (string) `'left'` or `'right'`
\*/
sprite.prototype.switch_lr = function(dir) //switch to `dir`
{
	if( dir!==this.dir)
	{
		this.dir=dir;
		this.sp.set_flipx(dir==='left');
	}
}
/*\
 * sprite.set_xy
 [ method ]
 - x (number)
 - y (number)
\*/
sprite.prototype.set_x_y = function(x,y)
{
	this.sp.set_x_y(x,y);
}
/*\
 * sprite.set_z
 [ method ]
 - Z (number)
\*/
sprite.prototype.set_z = function(Z)
{
	this.sp.set_z(Z);
}
/*\
 * sprite.show
 [ method ]
\*/
sprite.prototype.show = function()
{
	this.sp.show();
}
/*\
 * sprite.hide
 [ method ]
\*/
sprite.prototype.hide = function()
{
	this.sp.hide();
}

return sprite;
});

/*\
 * mechanics
 * 
 * mechanical properties that all living objects should have
 * performance:
 *	- objects are being created on every call of `body`
\*/

define('LF/mechanics',['LF/global'],
function(Global){

var GC=Global.gameplay;

/*\
 * mech
 [ class ]
 * mech is a state-less helper class that processes most of the mechanics of living objects
\*/
function mech(parent)
{
	var spec=parent.match.spec;
	if( spec[parent.id] && spec[parent.id].mass!==undefined && spec[parent.id].mass!==null)
		this.mass=spec[parent.id].mass;
	else
		this.mass=Global.gameplay.default.machanics.mass;

	this.ps;
	this.sp=parent.sp;
	this.frame=parent.frame;
	this.parent=parent;
	this.vol_body={0:{},1:{},2:{},3:{},4:{},5:{},length:0,empty_data:{},max:6};
	this.bg=parent.bg;
	this.sha=parent.shadow;
}

//return the array of volume of the current frame, that volume can be bdy,itr or other
mech.prototype.body= function(obj,filter,offset)
{
	var ps=this.ps;
	var sp=this.sp;
	var off=offset;
	if(!obj)
		obj=this.frame.D.bdy;
	//if parent object is in `super` effect, returns no body volume
	if( obj===this.frame.D.bdy && this.parent.effect.super)
		return this.body_empty();
	//if meets certain criteria (as in most cases), will use optimized version
	if( obj===this.frame.D.bdy && !filter && (!(obj instanceof Array) || obj.length<=this.vol_body.max))
		return this.body_body(offset);

	if( obj instanceof Array)
	{ //many bdy
		if( !filter && obj.length === 2)
		{ //unroll the loop
			return ([this.volume(obj[0],off),
				this.volume(obj[1],off)
			]);
		}
		else if( !filter && obj.length === 3)
		{ //unroll the loop
			return ([this.volume(obj[0],off),
				this.volume(obj[1],off),
				this.volume(obj[2],off)
			]);
		}
		else
		{
			var B=[];
			for( var i in obj)
			{
				if( !filter || filter(obj[i]))
					B.push( this.volume(obj[i],off) );
			}
			return B;
		}
	}
	else
	{ //1 bdy only
		if( !filter || filter(obj))
			return [this.volume(obj,off)];
		else
			return [];
	}
}

//returns a pseudo array with zero element
mech.prototype.body_empty= function()
{
	this.vol_body.length = 0;
	return this.vol_body;
}

//a slightly optimized version, creating less new objects
mech.prototype.body_body= function(V)
{
	var O=this.frame.D.bdy;
	var ps=this.ps;
	var sp=this.sp;

	if( !O)
	{	//no bdy
		var B=this.vol_body[0];
		if(V)
		{
			B.x=V.x;
			B.y=V.y;
			B.z=V.z;
		}
		else
		{
			B.x=ps.sx;
			B.y=ps.sy;
			B.z=ps.sz;
		}
		B.vx=0;
		B.vy=0;
		B.w=0;
		B.h=0;
		B.zwidth=0;
		B.data=this.vol_body.empty_data;
		this.vol_body.length=1;
	}
	else if( O instanceof Array)
	{	//many bdy
		for( var i=0; i<O.length; i++)
		{
			var B=this.vol_body[i];
			var vx=O[i].x;
			if( ps.dir==='left')
				vx=sp.w-O[i].x-O[i].w;
			if(V)
			{
				B.x=ps.sx+V.x;
				B.y=ps.sy+V.y;
				B.z=ps.sz+V.z;
			}
			else
			{
				B.x=ps.sx;
				B.y=ps.sy;
				B.z=ps.sz;
			}
			B.vx=vx;
			B.vy=O[i].y;
			B.w=O[i].w;
			B.h=O[i].h;
			B.zwidth=O[i].zwidth? O[i].zwidth : GC.default.itr.zwidth;
			B.data=O[i];
		}
		this.vol_body.length=O.length;
	}
	else
	{	//1 bdy only
		var B=this.vol_body[0];
		var vx=O.x;
		if( ps.dir==='left')
			vx=sp.w-O.x-O.w;
		if(V)
		{
			B.x=ps.sx+V.x;
			B.y=ps.sy+V.y;
			B.z=ps.sz+V.z;
		}
		else
		{
			B.x=ps.sx;
			B.y=ps.sy;
			B.z=ps.sz;
		}
		B.vx=vx;
		B.vy=O.y;
		B.w=O.w;
		B.h=O.h;
		B.zwidth=O.zwidth? O.zwidth : GC.default.itr.zwidth;
		B.data=O;
		this.vol_body.length=1;
	}
	return this.vol_body;
}

/** make a `volume` that is compatible with `scene` query
	param O volume in data
	param V offset
 */
mech.prototype.volume= function(O,V)
{
	var ps=this.ps;
	var sp=this.sp;

	if( !O)
	{
		if( !V)
			return {
				x:ps.sx, y:ps.sy, z:ps.sz,
				vx:0, vy:0, w:0, h:0, zwidth:0,
				data: {}
			}
		else
			return {
				x:V.x, y:V.y, z:V.z,
				vx:0, vy:0, w:0, h:0, zwidth:0,
				data: {}
			}
	}

	var vx=O.x;
	if( ps.dir==='left')
		vx=sp.w-O.x-O.w;

	if( !V)
		return {
			x:ps.sx, y:ps.sy, z:ps.sz,
			vx: vx,
			vy: O.y,
			w : O.w,
			h : O.h,
			zwidth: O.zwidth? O.zwidth : GC.default.itr.zwidth,
			data: O
		}
	else
		return {
			x:ps.sx+V.x, y:ps.sy+V.y, z:ps.sz+V.z,
			vx: vx,
			vy: O.y,
			w : O.w,
			h : O.h,
			zwidth: O.zwidth? O.zwidth : GC.default.itr.zwidth,
			data: O
		}
}

mech.prototype.make_point= function(a,prefix)
{
	var ps=this.ps;
	var sp=this.sp;

	if( a && !prefix)
	{
		if( ps.dir==='right')
			return {x:ps.sx+a.x, y:ps.sy+a.y, z:ps.sz+a.y};
		else
			return {x:ps.sx+sp.w-a.x, y:ps.sy+a.y, z:ps.sz+a.y};
	}
	else if( a && prefix)
	{
		if( ps.dir==='right')
			return {x:ps.sx+a[prefix+'x'], y:ps.sy+a[prefix+'y'], z:ps.sz+a[prefix+'y']};
		else
			return {x:ps.sx+sp.w-a[prefix+'x'], y:ps.sy+a[prefix+'y'], z:ps.sz+a[prefix+'y']};
	}
	else
	{
		console.log('mechanics: make point failed');
		return {x:ps.sx, y:ps.sy, z:ps.sz};
	}
}

//move myself *along xz* to coincide point a with point b such that point b is a point of myself
mech.prototype.coincideXZ= function(a,b)
{
	var ps=this.ps;
	var sp=this.sp;
	var fD=this.frame.D;

	var vx=a.x-b.x;
	var vz=a.z-b.z;
	ps.x+=vx;
	ps.z+=vz;
	ps.sx = ps.dir==='right'? (ps.x-fD.centerx):(ps.x+fD.centerx-sp.w);
}

//move myself *along xy* to coincide point a with point b such that point b is a point of myself
mech.prototype.coincideXY= function(a,b)
{
	var ps=this.ps;
	var sp=this.sp;
	var fD=this.frame.D;

	var vx=a.x-b.x;
	var vy=a.y-b.y;
	ps.x+=vx;
	ps.y+=vy;
	ps.sx = ps.dir==='right'? (ps.x-fD.centerx):(ps.x+fD.centerx-sp.w);
	ps.sy = ps.y - fD.centery;
}

mech.prototype.create_metric= function()
{
	this.ps = {
		sx:0,sy:0,sz:0, //sprite origin, read-only
		x:0, y:0, z:0, //feet position as in centerx,centery
		vx:0,vy:0,vz:0, //velocity
		zz:0,  //z order deviation
		dir:'right',  //direction
		fric:1 //factor of friction
	}
	return this.ps;
}

mech.prototype.reset= function()
{
	var ps=this.ps;
	ps.sx=0; ps.sy=0; ps.sz=0;
	ps.x=0; ps.y=0; ps.z=0;
	ps.vx=0; ps.vy=0; ps.vz=0;
	ps.zz=0;
	ps.dir='right';
	ps.fric=1;
}

//place the feet position of the object at x,y,z
mech.prototype.set_pos= function(x,y,z)
{
	var ps=this.ps;
	var sp=this.sp;
	var fD=this.frame.D;

	ps.x=x; ps.y=y; ps.z=z;
	if( ps.z < this.bg.zboundary[0]) //z bounding
		ps.z = this.bg.zboundary[0];
	if( ps.z > this.bg.zboundary[1])
		ps.z = this.bg.zboundary[1];

	ps.sx = ps.dir==='right'? (ps.x-fD.centerx):(ps.x+fD.centerx-sp.w);
	ps.sy = y - fD.centery;
	ps.sz = z;
}

mech.prototype.dynamics= function()
{
	var ps=this.ps;
	var sp=this.sp;
	var fD=this.frame.D;
	var GC=Global.gameplay;

	if( !this.blocking_xz()) //blocked by obstacle
	{
		ps.x += ps.vx;
		ps.z += ps.vz;
	}
	if( this.floor_xbound)
	{
		if( ps.x<0)
			ps.x=0;
		if( ps.x>this.bg.width)
			ps.x=this.bg.width;
	}
	if( ps.z < this.bg.zboundary[0]) //z bounding
		ps.z = this.bg.zboundary[0];
	if( ps.z > this.bg.zboundary[1])
		ps.z = this.bg.zboundary[1];

	ps.y += ps.vy;

	ps.sx = ps.dir==='right'? (ps.x-fD.centerx):(ps.x+fD.centerx-sp.w);
	ps.sy = ps.y - fD.centery;
	ps.sz = ps.z;

	if( ps.y>0)
	{	//never below the ground
		ps.y=0;
		ps.sy = ps.y - fD.centery;
	}

	sp.set_x_y(Math.floor(ps.sx), Math.floor(ps.sy+ps.sz)); //projection onto screen
	sp.set_z(Math.floor(ps.sz+ps.zz)); //z ordering
	if( this.sha)
	{
		this.sha.set_x_y(Math.floor(ps.x-this.bg.shadow.x), Math.floor(ps.z-this.bg.shadow.y));
		this.sha.set_z(Math.floor(ps.sz-1));
	}

	if( ps.y===0 && this.mass>0) //only when on the ground
	{
		//simple friction
		if( ps.vx) ps.vx += (ps.vx>0?-1:1)*ps.fric;
		if( ps.vz) ps.vz += (ps.vz>0?-1:1)*ps.fric;
		if( ps.vx!==0 && ps.vx>-GC.min_speed && ps.vx<GC.min_speed) ps.vx=0; //defined minimum speed
		if( ps.vz!==0 && ps.vz>-GC.min_speed && ps.vz<GC.min_speed) ps.vz=0;
	}

	if( ps.y<0)
		ps.vy+= this.mass * GC.gravity;
}

mech.prototype.unit_friction=function()
{
	var ps=this.ps;
	if( ps.y===0) //only when on the ground
	{
		if( ps.vx) ps.vx += (ps.vx>0?-1:1);
		if( ps.vz) ps.vz += (ps.vz>0?-1:1);
	}
}

mech.prototype.linear_friction=function(x,z)
{
	var ps=this.ps;
	if( x && ps.vx) ps.vx += ps.vx>0 ? -x:x;
	if( z && ps.vz) ps.vz += ps.vz>0 ? -z:z;
}

//return true if there is a blocking itr:kind:14 ahead
mech.prototype.blocking_xz=function()
{
	var offset = {
		x: this.ps.vx,
		y: 0,
		z: this.ps.vz
	}

	if( this.parent.type!=='character')
		return false;

	var body = this.body(null,null,offset);
	for( var i=0; i<body.length; i++)
	{
		body[i].zwidth=0;
		var result = this.parent.scene.query( body[i], this.parent, {tag:'itr:14'});
		if( result.length > 0)
			return true;
	}
}

mech.prototype.project= function()
{
	var ps=this.ps;
	var sp=this.sp;
	sp.set_x_y(ps.sx, ps.sy+ps.sz); //projection onto screen
	sp.set_z(ps.sz+ps.zz);  //z ordering
}

mech.prototype.speed=function()
{
	var ps=this.ps;
	return Math.sqrt(ps.vx*ps.vx + ps.vy*ps.vy);
}

return mech;
});

/*\
 * AI.js
 * support AI scripting
\*/

define('LF/AI',['F.core/util'],
function(Futil)
{
	/*\
	 * AIinterface
	 [ class ]
	 * adaptor interface for old-school AI scripting
	 * may be slow and buggy. do not use if you are writing new AI scripts
	\*/
	function AIin(self)
	{
		this.self = self;
	}
	AIin.prototype.facing=function()
	{
		var $=this.self;
		return $.ps.dir==='left';
	}
	AIin.prototype.type=function()
	{
		var $=this.self;
		switch ($.type)
		{
			case 'character':     return 0;
			case 'lightweapon':   return 1;
			case 'heavyweapon':   return 2;
			case 'specialattack': return 3;
			case 'baseball':      return 4;
			case 'criminal':      return 5;
			case 'drink':         return 6;
		}
	}
	AIin.prototype.weapon_type=function()
	{
		var $=this.self;
		if( $.hold.obj)
			switch ($.hold.obj.type)
			{
				case 'lightweapon':
					if( $.proper($.hold.obj.id,'stand_throw'))
						return 101;
					else
						return 1;
				break;
				case 'heavyweapon':
					return 2;
				break;
				case 'character':
					//I am being held
					return -1*$.AI.type();
				break;
			}
		return 0;
	}
	AIin.prototype.weapon_held=function()
	{
		var $=this.self;
		if( $.hold.obj)
			return $.hold.obj.uid;
		return -1;
	}
	AIin.prototype.weapon_holder=function()
	{
		var $=this.self;
		if( $.hold && $.hold.obj)
		switch ($.AI.type())
		{
			case 1: case 2: case 4: case 6:
			return $.hold.obj.uid;
		}
	}
	AIin.prototype.clone=function()
	{
		return -1;
	}
	AIin.prototype.blink=function()
	{
		var $=this.self;
		if( $.effect.blink)
			return Math.round($.effect.timeout/2);
		return 0;
	}
	AIin.prototype.shake=function()
	{
		var $=this.self;
		if( $.effect.oscillate)
			return $.effect.timeout * ($.effect.dvx||$.effect.dvy?1:-1);
		return 0;
	}
	AIin.prototype.ctimer=function()
	{
		var $=this.self;
		if( $.catching && $.state()===9)
			return $.statemem.counter*6;
		return 0;
	}
	AIin.prototype.seqcheck=function(qe)
	{
		var $=this.self;
		if( $.combodec)
		{
			var seq = $.combodec.seq;
			if( seq.length<1 || qe.length<1) return 0;
			var k1 = seq[seq.length-1];
			if( k1===qe[0]) return 1;
			if( seq.length<2 || qe.length<2) return 0;
			var k2 = seq[seq.length-2];
			if( k2===qe[0] && k1===[1]) return 2;
			if( seq.length<3 || qe.length<3) return 0;
			var k3 = seq[seq.length-3];
			if( k3===qe[0] && k2===qe[1] && k1===qe[2]) return 3;
		}
		return 0;
	}
	AIin.prototype.rand=function(i)
	{
		var $=this.self;
		return Math.floor($.match.random()*i);
	}
	AIin.prototype.frame=function(N)
	{
		var $=this.self;
		var tags={'bdy':'make_array','itr':'make_array','wpoint':'object'};
		if( !this.cache)
			this.cache={O:{}};
		if( this.cache.N===N)
			return this.cache.O;
		else
		{
			this.cache.N=N;
			var O = this.cache.O = {};
			if( $.data.frame[N])
			for( var I in $.data.frame[N])
			{
				if( typeof $.data.frame[N][I]==='object')
				{
					if( tags[I]==='make_array')
					{
						var arr = Futil.make_array($.data.frame[N][I]);
						O[I+'_count'] = arr.length;
						O[I+'s'] = arr;
					}
					else if( tags[I]==='object')
					{
						O[I] = $.data.frame[N][I];
					}
				}
				else
					O[I] = $.data.frame[N][I];
			}
			else
			{
				for( var t in tags)
					if( tags[t]==='make_array')
						O[t+'_count'] = 0;
			}
			return O;
		}
	}
	AIin.prototype.frame1=function(N)
	{
		return 0;
	}

	function AIcon()
	{
		this.state={};
		this.child=new Array();
		this.sync=true;
		this.buf=new Array();
	}
	AIcon.prototype.key=function(key,down)
	{
		if( this.sync)
		{
			this.buf.push([key,down]);
		}
		else
		{
			if( this.child)
				for(var J in this.child)
					this.child[J].key(key,down);
			this.state[I]=down;
		}
	}
	AIcon.prototype.keypress=function(key,x,y)
	{
		if( (x===undefined && y===undefined) ||
			(x===1 && y===0))
		{
			if( this.state[key])
				this.key(key,0);
			this.key(key,1);
			this.key(key,0);
		}
		else if(x===1 && y===1)
		{
			if( !this.state[key])
				this.key(key,1);
		}
		else if(x===0 && y===0)
		{
			if( this.state[key])
				this.key(key,0);
		}
	}
	AIcon.prototype.keyseq=function(seq)
	{
		for( var i=0; i<seq.length; i++)
			this.keypress(seq[i]);
	}
	AIcon.prototype.clear_states=function()
	{
		for(var I in this.state)
			this.state[I]=0;
	}
	AIcon.prototype.fetch=function()
	{
		for( var i=0; i<this.buf.length; i++)
		{
			var I=this.buf[i][0];
			var down=this.buf[i][1];
			if( this.child)
				for(var j=0; j<this.child.length; j++)
					this.child[j].key(I,down);
			this.state[I]=down;
		}
		this.buf.length=0;
	}
	AIcon.prototype.flush=function()
	{
		this.buf.length=0;
	}
	AIcon.prototype.type = 'AIcontroller';

	return {
		interface:AIin,
		controller:AIcon
	};
});

/*\
 * livingobject
 * 
 * a base class for all living objects
\*/
define('LF/livingobject',['LF/global','LF/sprite','LF/mechanics','LF/AI','LF/util','LF/sprite-select','F.core/util'],
function ( Global, Sprite, Mech, AI, util, Fsprite, Futil)
{
	var GC=Global.gameplay;

	/*\
	 * livingobject
	 [ class ]
	 | config=
	 | {
	 | match,
	 | controller, (characters only)
	 | team
	 | }
	\*/
	function livingobject(config,data,thisID)
	{
		if( !config)
			return;

		var $=this;

		//identity
		$.name=data.bmp.name;
		$.uid=-1; //unique id, set by scene
		$.id=thisID; //character id, specify tactical behavior. accept values from 0~99
		$.data=data;
		$.team=config.team;
		$.statemem = {}; //state memory, will be cleared on every state transition

		//handles
		$.match=config.match;
		$.scene=$.match.scene;
		$.bg=$.match.background;

		//states
		$.sp = new Sprite(data.bmp, $.match.stage);
		$.sp.width = data.bmp.file[0].w;
		if( !$.proper('no_shadow'))
		{
			var sp_sha=
			{
				canvas: $.match.stage,
				wh: 'fit',
				img: $.bg.shadow.img
			}
			$.shadow = new Fsprite(sp_sha);
		}
		$.health=
		{
			hp: 100,
			mp: 100
		};
		$.frame=
		{
			PN: 0, //previous frame number
			N: 0, //current frame number
			D: data.frame[0], //current frame's data object
			ani: //animation sequence
			{
				i:0, up:true
			}
		};
		$.mech = new Mech($);
		$.AI = new AI.interface($);
		$.ps = $.mech.create_metric(); //position, velocity, and other physical properties
		$.trans = new frame_transistor($);
		$.itr=
		{
			arest: 0, //attack rest - time until the attacker can do a single hit again
			vrest:[], //victim rest - time until a character can be hit again
		};
		$.effect=
		{
			num: -99, //effect number
			dvx: 0, dvy: 0,
			stuck: false, //when an object is said to be 'stuck', there is not state and frame update
			oscillate: 0, //if oscillate is non-zero, will oscillate for amplitude equals value of oscillate
			blink: false, //blink: hide 2 TU, show 2 TU ,,, until effect vanishs
			super: false, //when an object is in state 'super', it does not return body volume, such that it cannot be hit
			timein: 0, //time to take effect
			timeout: 0, //time to lose effect
			heal: undefined
		};
		$.catching= 0; //state 9: the object being caught by me now
					//OR state 10: the object catching me now
		$.allow_switch_dir=true; //direction switcher
	}
	livingobject.prototype.type='livingobject';
	//livingobject.prototype.states = null; //the collection of states forming a state machine
	//livingobject.prototype.states_switch_dir = null; //whether to allow switch dir in each state

	livingobject.prototype.destroy = function()
	{
		this.sp.destroy();
		this.shadow.remove();
	}

	livingobject.prototype.log = function(mes)
	{
		this.match.log(mes);
	}

	//setup for a match
	livingobject.prototype.setup = function()
	{
		var $=this;
		$.state_update('setup');
	}

	//update done at every frame
	livingobject.prototype.frame_update = function()
	{
		var $=this;
		//show frame
		$.sp.show_pic($.frame.D.pic);

		$.ps.fric=1; //reset friction

		if( !$.state_update('frame_force'))
			$.frame_force();

		//wait for next frame
		$.trans.set_wait($.frame.D.wait,99);
		$.trans.set_next($.frame.D.next,99);

		//state generic then specific update
		$.state_update('frame');
		
		if( $.frame.D.sound)
			$.match.sound.play($.frame.D.sound);
	}

	livingobject.prototype.frame_force = function()
	{
		var $=this;
		if( $.frame.D.dvx)
		{
			var avx = $.ps.vx>0?$.ps.vx:-$.ps.vx;
			if( $.ps.y<0 || avx < $.frame.D.dvx) //accelerate..
				$.ps.vx = $.dirh() * $.frame.D.dvx; //..is okay
			//decelerate must be gradual
			if( $.frame.D.dvx<0)
				$.ps.vx = $.ps.vx - $.dirh();
		}
		if( $.frame.D.dvz) $.ps.vz = $.dirv() * $.frame.D.dvz;
		if( $.frame.D.dvy) $.ps.vy += $.frame.D.dvy;
		if( $.frame.D.dvx===550) $.ps.vx = 0;
		if( $.frame.D.dvy===550) $.ps.vy = 0;
		if( $.frame.D.dvz===550) $.ps.vz = 0;
	}

	//update done at every TU (30fps)
	livingobject.prototype.TU_update = function()
	{
		var $=this;

		if( !$.state_update('TU_force'))
			$.frame_force();

		//effect
		if( $.effect.timein<0)
		{
			if( $.effect.oscillate)
			{
				if( $.effect.oi===1)
					$.effect.oi=-1;
				else
					$.effect.oi=1;
				$.sp.set_x_y($.ps.sx + $.effect.oscillate*$.effect.oi, $.ps.sy+$.ps.sz);
			}
			else if( $.effect.blink)
			{
				if( $.effect.bi===undefined)
					$.effect.bi = 0;
				switch ($.effect.bi%4)
				{
					case 0: case 1:
						$.sp.hide();
					break;
					case 2: case 3:
						$.sp.show();
					break;
				}
				$.effect.bi++;
			}
			if( $.effect.timeout===0)
			{
				$.effect.num = -99;
				if( $.effect.stuck)
				{
					$.effect.stuck = false;
				}
				if( $.effect.oscillate)
				{
					$.effect.oscillate = 0;
					$.sp.set_x_y($.ps.sx, $.ps.sy+$.ps.sz);
				}
				if( $.effect.blink)
				{
					$.effect.blink = false;
					$.effect.bi = undefined;
					$.sp.show();
				}
				if( $.effect.super)
				{
					$.effect.super = false;
				}
			}
			else if( $.effect.timeout===-1)
			{
				if( $.effect.dvx) $.ps.vx = $.effect.dvx;
				if( $.effect.dvy) $.ps.vy = $.effect.dvy;
				$.effect.dvx=0;
				$.effect.dvy=0;
			}
			$.effect.timeout--;
		}

		if( $.effect.timein<0 && $.effect.stuck)
			; //stuck
		else
			$.state_update('TU');

		if( $.health.hp<=0)
			if( !$.dead)
			{
				$.state_update('die');
				$.dead = true
			}

		if( $.bg.leaving($))
			$.state_update('leaving');

		for( var I in $.itr.vrest)
		{	//watch out that itr.vrest might grow very big
			if( $.itr.vrest[I] > 0)
				$.itr.vrest[I]--;
		}
		if( $.itr.arest > 0)
			$.itr.arest--;
	}

	livingobject.prototype.state_update=function(event)
	{
		var $=this;
		var tar1=$.states['generic'];
		if( tar1) var res1=tar1.apply($,arguments);
		//
		var tar2=$.states[$.frame.D.state];
		if( tar2) var res2=tar2.apply($,arguments);
		//
		return res1 || res2;
	}

	livingobject.prototype.TU=function()
	{
		var $=this;
		//state
		$.TU_update();
	}

	livingobject.prototype.transit=function()
	{
		var $=this;
		//fetch inputs
		if( $.con)
		{
			//$.con.fetch(); //match is responsible for fetching
			$.combo_update();
		}
		//frame transition
		if( $.effect.timein<0 && $.effect.stuck)
			; //stuck!
		else
			$.trans.trans();
		$.effect.timein--;
		if( $.effect.timein<0 && $.effect.stuck)
			; //stuck!
		else
			$.state_update('transit');
	}

	livingobject.prototype.set_pos=function(x,y,z)
	{
		this.mech.set_pos(x,y,z);
	}

	//return the body volume for collision detection
	//  all other volumes e.g. itr should start with prefix vol_
	livingobject.prototype.vol_body=function() 
	{
		return this.mech.body();
	}

	livingobject.prototype.state=function()
	{
		return this.frame.D.state;
	}

	livingobject.prototype.effect_id=function(num)
	{
		return num+GC.effect.num_to_id;
	}

	livingobject.prototype.effect_create=function(num,duration,dvx,dvy)
	{
		var $=this;
		if( num >= $.effect.num)
		{
			var efid= num+GC.effect.num_to_id;
			if( $.proper(efid,'oscillate'))
				$.effect.oscillate=$.proper(efid,'oscillate');
			if( $.proper(efid,'cant_move'))
				$.effect.stuck=true;
			if( dvx!==undefined)
				$.effect.dvx = dvx;
			if( dvy!==undefined)
				$.effect.dvy = dvy;
			if( $.effect.num>=0)
			{	//only allow extension of effect
				if( 0 < $.effect.timein)
					$.effect.timein=0;
				if( duration > $.effect.timeout)
					$.effect.timeout=duration;
			}
			else
			{
				$.effect.timein=0;
				$.effect.timeout=duration;
			}
			$.effect.num = num;
		}
	}

	livingobject.prototype.effect_stuck=function(timein,timeout)
	{
		var $=this;
		if( !$.effect.stuck || $.effect.num<=-1)
		{
			$.effect.num=-1; //magic number
			$.effect.stuck=true;
			$.effect.timein=timein;
			$.effect.timeout=timeout;
		}
	}

	livingobject.prototype.visualeffect_create=function(num, rect, righttip, variant, with_sound)
	{
		var $=this;
		var efid= num+GC.effect.num_to_id;
		var pos=
		{
			x: rect.x+ rect.vx+ (righttip?rect.w:0),
			y: rect.y+ rect.vy+ rect.h/2,
			z: rect.z>$.ps.z ? rect.z:$.ps.z
		}
		$.match.visualeffect.create(efid,pos,variant,with_sound);
	}

	//animate back and forth between frame a and b
	livingobject.prototype.frame_ani_oscillate=function(a,b)
	{
		var $=this;
		var $f=$.frame;
		if( $f.ani.i<a || $f.ani.i>b)
		{
			$f.ani.up=true;
			$f.ani.i=a+1;
		}
		if( $f.ani.i<b && $f.ani.up)
			$.trans.set_next($f.ani.i++);
		else if( $f.ani.i>a && !$f.ani.up)
			$.trans.set_next($f.ani.i--);
		if( $f.ani.i==b) $f.ani.up=false;
		if( $f.ani.i==a) $f.ani.up=true;
	}

	livingobject.prototype.frame_ani_sequence=function(a,b)
	{
		var $=this;
		var $f=$.frame;
		if( $f.ani.i<a || $f.ani.i>b)
		{
			$f.ani.i=a+1;
		}
		trans.set_next($f.ani.i++);
		if( $f.ani.i > b)
			$f.ani.i=a;
	}

	livingobject.prototype.itr_arest_test=function()
	{
		var $=this;
		return !$.itr.arest;
	}
	livingobject.prototype.itr_arest_update=function(ITR)
	{
		var $=this;
		if( ITR && ITR.arest)
			$.itr.arest = ITR.arest;
		else
			$.itr.arest = GC.default.character.arest;
	}
	livingobject.prototype.itr_vrest_test=function(uid)
	{
		var $=this;
		return !$.itr.vrest[uid];
	}
	livingobject.prototype.itr_vrest_update=function(attacker_uid,ITR)
	{
		var $=this;
		if( ITR && ITR.vrest)
			$.itr.vrest[attacker_uid] = ITR.vrest;
	}

	livingobject.prototype.switch_dir = function(e)
	{
		var $=this;
		if( $.ps.dir==='left' && e==='right')
		{
			$.ps.dir='right';
			$.sp.switch_lr('right');
		}
		else if( $.ps.dir==='right' && e==='left')
		{
			$.ps.dir='left';
			$.sp.switch_lr('left');
		}
	}

	livingobject.prototype.dirh = function()
	{
		var $=this;
		return ($.ps.dir==='left'?-1:1);
	}

	livingobject.prototype.dirv = function()
	{
		var $=this;
		var d=0;
		if( $.con)
		{
			if( $.con.state.up)   d-=1;
			if( $.con.state.down) d+=1;
		}
		return d;
	}

	livingobject.prototype.proper = function(id,prop)
	{
		var $=this;
		if( arguments.length===1)
		{
			prop=id;
			id=$.id;
		}
		if( $.match.spec[id])
			return $.match.spec[id][prop];
		return undefined;
	}

	function frame_transistor($)
	{
		var wait=1; //when wait decreases to zero, a frame transition happens
		var next=999; //next frame
		var lock=0;
		var lockout=1; //when lockout equals 0, the lock will be reset automatically
		//frame transitions are caused differently: going to the next frame, a combo is pressed, being hit, or being burnt
		//  and they can all happen *at the same TU*, to determine which frame to go to,
		//  each cause is given an authority which is used to resolve frame transition conflicts.
		//  lock=0 means unlocked
		//  common authority values:
		//0-9: natural
		//     0: natural
		// 10: move,defend,jump,punch,catching,caught
		// 11: special moves
		// 15: environmental interactions
		// 2x: interactions
		//    20: being punch
		//    25: hit by special attack
		// 3x: strong interactions
		//    30: in effect type 0
		//    35: blast
		//    36: fire
		//    38: ice

		this.frame=function(F,au)
		{
			//console.log('frame', F, au, arguments.callee.caller.toString()) //trace caller
			this.set_next(F,au);
			this.set_wait(0,au);
		}

		this.set_wait=function(value,au,out)
		{
			if(!au) au=0; //authority
			if( au===99) au=lock; //au=99 means always has just enough authority
			if(!out) out=1; //lock timeout
			if( au >= lock)
			{
				lock=au;
				lockout=out;
				if( out===99) //out=99 means lock until frame transition
					lockout=wait;
				wait=value;
				if( wait<0) wait=0;
			}
		}

		this.inc_wait=function(inc,au,out) //increase wait by inc amount
		{
			if(!au) au=0;
			if( au===99) au=lock;
			if(!out) out=1;
			if( au >= lock)
			{
				lock=au;
				lockout=out;
				if( out===99)
					lockout=wait;
				wait+=inc;
				if( wait<0) wait=0;
			}
		}

		this.next=function()
		{
			return next;
		}
		this.wait=function()
		{
			return wait;
		}

		this.set_next=function(value,au,out)
		{
			if(!au) au=0;
			if( au===99) au=lock;
			if(!out) out=1;
			if( au >= lock)
			{
				lock=au;
				lockout=out;
				if( out===99)
					lockout=wait;
				next=value;
			}
		}

		this.reset_lock=function(au)
		{
			if(!au) au=0;
			if( au===99) au=lock;
			if( au >= lock)
			{
				lock=0;
			}
		}

		this.next_frame_D=function()
		{
			var anext = next;
			if( anext===999)
				anext=0;
			return $.data.frame[anext];
		}

		this.trans=function()
		{
			var oldlock=lock;
			lockout--;
			if( lockout===0)
				lock=0; //reset transition lock

			if( wait===0)
			{
				if( next===0)
				{
					//do nothing
				}
				else
				{
					if( next===1000)
					{
						$.match.destroy_object($);
						return;
					}
					if( $.health.hp<=0 && $.frame.D.state===14)
						return;

					if( next===999)
						next=0;
					$.frame.PN=$.frame.N;
					$.frame.N=next;
					$.state_update('frame_exit');

					//state transition
					var is_trans = $.frame.D.state !== $.data.frame[next].state;
					if( is_trans)
						$.state_update('state_exit');

					$.frame.D=$.data.frame[next];

					if( is_trans)
					{
						for( var I in $.statemem)
							$.statemem[I] = undefined;
						var old_switch_dir=$.allow_switch_dir;
						if( $.states_switch_dir && $.states_switch_dir[$.frame.D.state] !== undefined)
							$.allow_switch_dir=$.states_switch_dir[$.frame.D.state];
						else
							$.allow_switch_dir=false;

						$.state_update('state_entry');

						if( $.allow_switch_dir && !old_switch_dir)
						{
							if( $.con)
							{
								if($.con.state.left) $.switch_dir('left');
								if($.con.state.right) $.switch_dir('right');
							}
						}
					}

					$.frame_update();

					if( oldlock===10 || oldlock===11) //combo triggered action
						if( wait>0)
							wait-=1;
				}
			}
			else
				wait--;
		}
	} // frame_transistor

	return livingobject;
});

/*\
 * combo detector
 * - listen key events and detect combo from a controller
 * - maintains a clean sequence of pressed keys and fire events when combo is detected
 * - LF2, KOF style combos
 * - eliminating auto-repeated keys
\*/

define('F.core/combodec',[], function(){

/*\
 * combodec
 [ class ]
 - controller (object) a reference to @controller
 - config (object)
 - combo (array) combo definition
|	var con_config=
|	{
|		up:'h',down:'n',left:'b',right:'m',def:'v',jump:'f',att:'d'
|		//,'control name':'control key',,,
|	}
|	var con = new controller(con_config);
|	var dec_config=
|	{
|		timeout: 30,  //[optional] time before clearing the sequence buffer in terms of frames
|		comboout: 15, //[optional] the max time interval between keys to make a combo,
|			//an interrupt is inserted when comboout expires
|		clear_on_combo: true, //[optional] if true, will clear the sequence buffer when a combo occur
|		callback: dec_callback, //callback function when combo detected
|		rp: {up:1,down:1,left:2,right:2,def:3,jump:1,att:5}
|			//[optional] max repeat count of each key, unlimited if not stated
|	};
|	var combo = [
|	{
|		name: 'blast',	//combo name
|		seq:  ['def','right','att'], //array of key sequence
|		maxtime: 10 //[optional] the max allowed time difference between the first and last key input
|		clear_on_combo: false, //[optional] override generic config
|	} //,,,
|	];
|	var dec = new combodec ( con, dec_config, combo);
|	function dec_callback(combo)
|	{
|		alert(combo);
|	}
 * [example](../sample/combo.html)
 # <iframe src="../sample/combo.html" width="800" height="500"></iframe>
\*/
function combodec (controller, config, combo)
{
	/*\
	 * combodec.time
	 - (number) current time
	 [ property ]
	\*/
	this.time=1;
	/*\
	 * combodec.timeout
	 - (number) when to clear the sequence buffer
	 [ property ]
	\*/
	this.timeout=0;
	/*\
	 * combodec.comboout
	 - (number) when to interrupt the current combo
	 [ property ]
	\*/
	this.comboout=0;
	/*\
	 * combodec.con
	 - (object) parent controller
	 [ property ]
	\*/
	this.con=controller;
	/*\
	 * combodec.seq
	 - (array) the key input sequence. note that combodec logs key names rather than key stroke,
	 * i.e. `up`,`down` rather than `w`,`s`
	 - (object) each is `{k:key,t:time}`
	 * 
	 * will be cleared regularly as defined by `config.timeout` or `config.clear_on_combo`
	 [ property ]
	\*/
	this.seq=new Array();
	/*\
	 * combodec.config
	 - (object)
	 [ property ]
	\*/
	this.config=config;
	/*\
	 * combodec.combo
	 - (array) combo list
	 [ property ]
	\*/
	this.combo=combo;
	this.con.child.push(this);
}

/*\
 * combodec.key
 * supply keys to combodec
 [ method ]
 - k (string) key name
 - down (boolean)
 * note that it receives key name, i.e. `up`,`down` rather than `w`,`s`
\*/
combodec.prototype.key=function(K, down)
{
	if(!down)
		return;

	var seq=this.seq;

	var push=true;
	if( this.config.rp)
	{	//detect repeated keys
		for (var i=seq.length-1, cc=1; i>=0 && seq[i]==K; i--,cc++)
			if( cc>=this.config.rp[K])
				push=false;
	}

	//eliminate repeated key strokes by browser; discard keys that are already pressed down
	if( this.con.state[K])
		push=false;
	//  remarks: opera linux has a strange behavior that repeating keys **do** fire keyup events

	if( this.config.timeout)
		this.timeout=this.time+this.config.timeout;
	if( this.config.comboout)
		this.comboout=this.time+this.config.comboout;

	if( push)
		seq.push({k:K,t:this.time});

	if ( this.combo && push)
	{	//detect combo
		var C = this.combo;
		for (var i in C)
		{
			var detected=true;
			var j=seq.length-C[i].seq.length;
			if( j<0) detected=false;
			else for (var k=0; j<seq.length; j++,k++)
			{
				if( C[i].seq[k] !== seq[j].k ||
					(C[i].maxtime && seq[seq.length-1].t-seq[j].t>C[i].maxtime))
				{
					detected=false;
					break;
				}
			}
			if( detected)
			{
				this.config.callback(C[i]);
				if( C[i].clear_on_combo || (C[i].clear_on_combo!==false && this.config.clear_on_combo))
					this.clear_seq();
			}
		}
	}
}

/*\
 * combodec.clear_seq
 * clear the key sequence
 [ method ]
 * normally you would not need to call this manually
\*/
combodec.prototype.clear_seq=function()
{
	this.seq.length=0;
	this.timeout=this.time-1;
	this.comboout=this.time-1;
}

/*\
 * combodec.frame
 * a tick of time
 [ method ]
\*/
combodec.prototype.frame=function()
{
	if( this.time===this.timeout)
		this.clear_seq();
	if( this.time===this.comboout)
		this.seq.push({k:'_',t:this.time});
	this.time++;
}

return combodec;
});

/**	a LF2 character
 */

define('LF/character',['LF/livingobject','LF/global','F.core/combodec','F.core/util','LF/util'],
function(livingobject, Global, Fcombodec, Futil, util)
{
	var GC=Global.gameplay;

	var states=
	{
		'generic':function(event,K)
		{	var $=this;
			switch (event) {
			case 'frame':
				//health reduce
				if( $.frame.D.mp)
				{
					if( $.data.frame[$.frame.PN].next===$.frame.N)
					{	//if this frame is transited by next of previous frame
						if( $.frame.D.mp<0)
						{
							if( !$.match.F6_mode)
								$.health.mp += $.frame.D.mp;
							$.health.mp_usage -= $.frame.D.mp;
							if( $.health.mp<0)
							{
								$.health.mp = 0;
								$.trans.frame($.frame.D.hit_d);
							}
						}
					}
					else
					{
						var dmp = $.frame.D.mp%1000,
							dhp = Math.floor($.frame.D.mp/1000)*10;
						if( !$.match.F6_mode)
							$.health.mp -= dmp;
						$.health.mp_usage += dmp;
						$.injury(dhp);
					}
				}
				$.opoint();
			break;
			case 'TU':
				if( $.state_update('post_interaction'))
					; //do nothing
				else
					$.post_interaction();

				var ps=$.ps;
				if( ps.y===0 && ps.vy===0 && $.frame.N===212 && $.frame.PN!==211)
				{
					$.trans.frame(999);
				}
				else if( ps.y===0 && ps.vy>0) //fell onto ground
				{
					var result = $.state_update('fell_onto_ground');
					if( result)
						$.trans.frame(result, 15);
					else
					{
						//console.log(ps.vx, util.lookup_abs(GC.friction.fell,ps.vx));
						ps.vy=0; //set to zero
						$.mech.linear_friction(
							util.lookup_abs(GC.friction.fell,ps.vx),
							util.lookup_abs(GC.friction.fell,ps.vz)
						);
					}
				}
				else if( ps.y+ps.vy>=0 && ps.vy>0) //predict falling onto the ground
				{
					var result = $.state_update('fall_onto_ground');
					if( result)
						$.trans.frame(result, 15);
					else
					{
						if( $.frame.N===212) //jumping
							$.trans.frame(215, 15); //crouch
						else
							$.trans.frame(219, 15); //crouch2
					}
				}

				//health recover
				//http://lf2.wikia.com/wiki/Health_and_mana
				if( $.match.time.t%12===0)
				if( 0 <= $.health.hp && $.health.hp < $.health.hp_bound)
					$.health.hp++;

				var heal_speed = 8;
				if( $.health.hp >= 0 && $.effect.heal && $.effect.heal>0)
				if( $.match.time.t%8===0)
				{
					if( $.health.hp+heal_speed <= $.health.hp_bound)
						$.health.hp += heal_speed;
					$.effect.heal -= heal_speed;
				}

				if( $.match.time.t%3===0)
				if( $.health.mp < $.health.mp_full)
				{
					$.health.mp+= 1+Math.floor(($.health.hp_full-($.health.hp<$.health.hp_full?$.health.hp:$.health.hp_full))/100);
				}
				//recovery
				if( $.health.fall>0) $.health.fall += GC.recover.fall;
				if( $.health.bdefend>0) $.health.bdefend += GC.recover.bdefend;
				//combo buffer
				$.combo_buffer.timeout--;
				if( $.combo_buffer.timeout===0)
				{
					switch ($.combo_buffer.combo)
					{
						case 'def': case 'jump': case 'att': case 'left-left': case 'right-right':
							$.combo_buffer.combo = null;
						break;
						//other combo is not cleared
					}
				}
			break;
			case 'transit':
				//dynamics: position, friction, gravity
				$.mech.dynamics(); //any further change in position will not be updated on screen until next TU
				$.wpoint(); //my holding weapon following my change
			break;
			case 'combo':
				switch(K)
				{
				case 'left': case 'right':
				case 'left-left': case 'right-right':
				break;
				default:
					//here is where D>A, D>J... etc handled
					var tag = Global.combo_tag[K];
					if( tag && $.frame.D[tag])
					{
						if( !$.id_update('generic_combo',K,tag))
						{
							$.trans.frame($.frame.D[tag], 11);
							return 1;
						}
					}
				}
			break;
			case 'post_combo': //after state specific processing
				$.pre_interaction();
			break;
			case 'state_exit':
				switch ($.combo_buffer.combo)
				{
					case 'left-left': case 'right-right':
						//cannot transfer across states
						$.combo_buffer.combo = null;
					break;
				}
			break;
		}},

		//state specific processing to different events

		'0':function(event,K) //standing
		{	var $=this;
			switch (event) {

			case 'frame':
				if( $.hold.obj && $.hold.obj.type==='heavyweapon')
					$.trans.frame(12);
			break;

			case 'combo':
				switch(K)
				{
				case 'left': case 'right': case 'up': case 'down':
				case 'jump': case null:
					var dx = $.con.state.left !== $.con.state.right,
						dz = $.con.state.up   !== $.con.state.down;
					if( dx || dz)
					{
						//apply movement
						if( $.hold.obj && $.hold.obj.type==='heavyweapon')
						{
							if( dx) $.ps.vx=$.dirh()*($.data.bmp.heavy_walking_speed);
							$.ps.vz=$.dirv()*($.data.bmp.heavy_walking_speedz);
						}
						else
						{
							if( K!=='jump')
								$.trans.frame(5, 5);
							if( dx) $.ps.vx=$.dirh()*($.data.bmp.walking_speed);
							$.ps.vz=$.dirv()*($.data.bmp.walking_speedz);
						}
					}
				break;
				}
				switch(K)
				{
				case 'left-left': case 'right-right':
					if( $.hold.obj && $.hold.obj.type==='heavyweapon')
						$.trans.frame(16, 10);
					else
						$.trans.frame(9, 10);
				return 1;
				case 'def':
					if( $.hold.obj && $.hold.obj.type==='heavyweapon')
						return 1;
					$.trans.frame(110, 10);
				return 1;
				case 'jump':
					if( $.hold.obj && $.hold.obj.type==='heavyweapon')
					{
						if( !$.proper('heavy_weapon_jump'))
							return 1;
						else
						{
							$.trans.frame($.proper('heavy_weapon_jump'), 10);
							return 1;
						}
					}
					$.trans.frame(210, 10);
				return 1;
				case 'att':
					if( $.hold.obj)
					{
						var dx = $.con.state.left !== $.con.state.right;
						if( $.hold.obj.type==='heavyweapon')
						{
							$.trans.frame(50, 10); //throw heavy weapon
							return 1;
						}
						else if( $.proper($.hold.obj.id,'just_throw'))
						{
							$.trans.frame(45, 10); //throw light weapon
							return 1;
						}
						else if ( dx && $.proper($.hold.obj.id,'stand_throw'))
						{
							$.trans.frame(45, 10); //throw weapon
							return 1;
						}
						else if( $.proper($.hold.obj.id,'attackable')) //light weapon attack
						{
							$.trans.frame($.match.random()<0.5? 20:25, 10);
							return 1;
						}
					}
					//
					var vol=$.mech.volume(Futil.make_array($.data.frame[72].itr)[0]); //super punch, frame 72
					var hit= $.scene.query(vol, $, {tag:'itr:6', not_team:$.team});
					for( var t in hit)
					{	//if someone is in my hitting scoope who has itr kind:6
						$.trans.frame(70, 10); //I 'll use super punch!
						return 1;
					}
					//
					$.trans.frame($.match.random()<0.5? 60:65, 10);
				return 1;
				}
			break;
		}},

		'1':function(event,K) //walking
		{	var $=this;

			var dx=0,dz=0;
			if($.con.state.left)  dx-=1;
			if($.con.state.right) dx+=1;
			if($.con.state.up)    dz-=1;
			if($.con.state.down)  dz+=1;
			switch (event) {

			case 'frame':
				if( $.hold.obj && $.hold.obj.type==='heavyweapon')
				{
					if( dx || dz)
						$.frame_ani_oscillate(12,15);
					else
						$.trans.set_next($.frame.N);
				}
				else
				{
					$.frame_ani_oscillate(5,8);
				}
				$.trans.set_wait($.data.bmp.walking_frame_rate-1);
			break;

			case 'TU':
				//apply movement
				var xfactor = 1-($.dirv()?1:0)*(2/7); //reduce x speed if moving diagonally
				if( $.hold.obj && $.hold.obj.type==='heavyweapon')
				{
					if( dx) $.ps.vx=xfactor*$.dirh()*($.data.bmp.heavy_walking_speed);
					$.ps.vz=$.dirv()*($.data.bmp.heavy_walking_speedz);
				}
				else
				{
					if( dx) $.ps.vx=xfactor*$.dirh()*($.data.bmp.walking_speed);
					$.ps.vz=$.dirv()*($.data.bmp.walking_speedz);
					if( !dx && !dz && $.trans.next()!==999)
					{
						$.trans.set_next(999); //go back to standing
						$.trans.set_wait(1,1,2);
					}
				}
			break;

			case 'state_entry':
				$.trans.set_wait(0);
			break;

			case 'combo':
				if( dx!==0 && dx!==$.dirh())
					$.switch_dir($.ps.dir==='right'?'left':'right'); //toogle dir
				if( !dx && !dz && !$.statemem.released)
				{
					$.statemem.released=true;
					$.mech.unit_friction();
				}
				//walking same as standing, except null combo
				if( K) return $.states['0'].call($,event,K);
			break;
		}},

		'2':function(event,K) //running, heavy_obj_run
		{	var $=this;
			switch (event) {

			case 'frame':
				if( $.hold.obj && $.hold.obj.type==='heavyweapon')
					$.frame_ani_oscillate(16,18);
				else
					$.frame_ani_oscillate(9,11);
				$.trans.set_wait($.data.bmp.running_frame_rate);
			//no break here

			case 'TU':
				//to maintain the velocity against friction
				var xfactor = 1-($.dirv()?1:0)*(1/7); //reduce x speed if moving diagonally
				if( $.hold.obj && $.hold.obj.type==='heavyweapon')
				{
					$.ps.vx= xfactor * $.dirh() * $.data.bmp.heavy_running_speed;
					$.ps.vz= $.dirv() * $.data.bmp.heavy_running_speedz;
				}
				else
				{
					$.ps.vx= xfactor * $.dirh() * $.data.bmp.running_speed;
					$.ps.vz= $.dirv() * $.data.bmp.running_speedz;
				}
			break;

			case 'combo':
				switch(K)
				{
				case 'left': case 'right': case 'left-left': case 'right-right':
					if( K.split('-')[0] !== $.ps.dir)
					{
						if( $.hold.obj && $.hold.obj.type==='heavyweapon')
							$.trans.frame(19, 10);
						else
							$.trans.frame(218, 10);
						return 1;
					}
				break;

				case 'def':
					if( $.hold.obj && $.hold.obj.type==='heavyweapon')
						return 1;
					$.trans.frame(102, 10);
				return 1;

				case 'jump':
					if( $.hold.obj && $.hold.obj.type==='heavyweapon')
					{
						if( !$.proper('heavy_weapon_dash'))
							return 1;
						else
						{
							$.trans.frame($.proper('heavy_weapon_dash'), 10);
							return 1;
						}
					}
					$.trans.frame(213, 10);
				return 1;

				case 'att':
					if( $.hold.obj)
					{
						if( $.hold.obj.type==='heavyweapon')
						{
							$.trans.frame(50, 10); //throw heavy weapon
							return 1;
						}
						else
						{
							var dx = $.con.state.left !== $.con.state.right;
							if( dx && $.proper($.hold.obj.id,'run_throw'))
							{
								$.trans.frame(45, 10); //throw light weapon
								return 1;
							}
							else if( $.proper($.hold.obj.id,'attackable'))
							{
								$.trans.frame(35, 10); //light weapon attack
								return 1;
							}
						}
					}
					$.trans.frame(85, 10);
				return 1;
				}
			break;
		}},

		'3':function(event,K) //punch, jump_attack, run_attack, ...
		{	var $=this;
			switch (event) {
			case 'frame':
				if( $.frame.D.next===999 && $.ps.y<0)
					$.trans.set_next(212); //back to jump
				if( $.frame.N===253) //Woody's fly_crash
					$.trans.set_wait(0);
				$.id_update('state3_frame');
			break;
			case 'hit_stop':
			return $.id_update('state3_hit_stop');
			case 'frame_force':
			return $.id_update('state3_frame_force');
		}},

		'4':function(event,K) //jump
		{	var $=this;
			switch (event) {

			case 'frame':
				$.statemem.frameTU=true;
				if( $.frame.PN===80 || $.frame.PN===81) //after jump attack
					$.statemem.attlock=2;
			break;

			case 'TU':
				if( $.statemem.frameTU)
				{	$.statemem.frameTU=false;
					if( $.frame.N===212 && $.frame.PN===211)
					{	//start jumping
						var dx=0;
						if($.con.state.left)  dx-=1;
						if($.con.state.right) dx+=1;
						$.ps.vx= dx * ($.data.bmp.jump_distance-1);
						$.ps.vz= $.dirv() * ($.data.bmp.jump_distancez-1);
						$.ps.vy= $.data.bmp.jump_height; //upward force
					}
				}
				if( $.statemem.attlock)
					$.statemem.attlock--;
			break;

			case 'combo':
				if( (K==='att' || $.con.state.att) && !$.statemem.attlock)
				{
					// a transition to jump_attack can only happen after entering frame 212
					if( $.frame.N===212)
					{
						if( $.hold.obj)
						{
							var dx = $.con.state.left !== $.con.state.right;
							if( dx && $.proper($.hold.obj.id,'jump_throw'))
								$.trans.frame(52, 10); //sky light weapon throw
							else if( $.proper($.hold.obj.id,'attackable'))
								$.trans.frame(30, 10); //light weapon attack
						}
						else
							$.trans.frame(80, 10); //jump attack
						return 1; //key consumed
					}
				}
			break;
		}},

		'5':function(event,K) //dash
		{	var $=this;
			switch (event) {
			case 'state_entry':
				if( (9<=$.frame.PN && $.frame.PN<=11) || //if previous is running
					($.frame.PN===215)) //or crouch
				{
					$.ps.vx= $.dirh() * ($.data.bmp.dash_distance-1) * ($.frame.N===213?1:-1);
					$.ps.vz= $.dirv() * ($.data.bmp.dash_distancez-1);
					$.ps.vy= $.data.bmp.dash_height;
				}
			break;

			case 'combo':
				if( K==='att' || $.con.state.att)
				{
					if( $.proper('dash_backattack') || //back attack
						$.dirh()===($.ps.vx>0?1:-1)) //if not turning back
					{
						if( $.hold.obj && $.proper($.hold.obj.id,'attackable')) //light weapon attack
							$.trans.frame(40, 10);
						else
							$.trans.frame(90, 10);
						$.allow_switch_dir=false;
						if( K==='att')
							return 1;
					}
				}
				if( K==='left' || K==='right')
				{
					if( K!=$.ps.dir)
					{
						if( $.dirh()==($.ps.vx>0?1:-1))
						{	//turn back
							if( $.frame.N===213) $.trans.frame(214, 0);
							if( $.frame.N===216) $.trans.frame(217, 0);
							$.switch_dir(K);
						}
						else
						{	//turn to front
							if( $.frame.N===214) $.trans.frame(213, 0);
							if( $.frame.N===217) $.trans.frame(216, 0);
							$.switch_dir(K);
						}
						return 1;
					}
				}
			break;
		}},

		'6':function(event,K) //rowing
		{	var $=this;
			switch (event) {
			case 'TU':
				if( $.frame.N===100 || $.frame.N===108)
				{
					$.ps.vy = 0;
				}
			break;
			
			case 'frame':
				if( $.frame.N===100 || $.frame.N===108)
				{
					$.trans.set_wait(1);
				}
			break;
			
			case 'fall_onto_ground':
				if( $.frame.N===101 || $.frame.N===109)
					return 215;
			break;
		}},

		'7':function(event,K) //defending
		{	var $=this;
			switch (event) {
			case 'frame':
				if( $.frame.N===111)
					$.trans.inc_wait(4);
			break;
		}},

		'8':function(event,K) //broken defend
		{	var $=this;
			switch (event) {
			case 'frame_force':
			case 'TU_force':
				//nasty fix: to compensate that frame_force is applied with respecting to facing direction
				if( $.frame.D.dvx)
				{
					if( ($.ps.vx>0?1:-1) !== $.dirh())
					{
						var avx = $.ps.vx>0?$.ps.vx:-$.ps.vx;
						var dirx = 2*($.ps.vx>0?1:-1);
						if( $.ps.y<0 || avx < $.frame.D.dvx)
							$.ps.vx = dirx * $.frame.D.dvx;
						if( $.frame.D.dvx<0)
							$.ps.vx = $.ps.vx - dirx;
					}
				}
			break;
		}},

		'9':function(event,K) //catching, throw lying man
		{	var $=this;
			switch (event) {
			case 'state_entry':
				$.statemem.stateTU=true;
				$.statemem.counter=43;
				$.statemem.attacks=0;
			break;

			case 'state_exit':
				$.catching=null;
				$.ps.zz=0;
			break;

			case 'frame':
				switch ($.frame.N)
				{
					case 123: //a successful attack
					$.statemem.attacks++;
					$.statemem.counter+=3;
					$.trans.inc_wait(1);
					break;
					case 233: case 234:
					$.trans.inc_wait(-1);
					break;
				}
				if( $.frame.N===234)
					return;
				$.catching.caught_b(
						$.mech.make_point($.frame.D.cpoint),
						$.frame.D.cpoint,
						$.ps.dir
					);
			break;

			case 'TU':
			if( $.caught_cpointkind()===1 &&
				$.catching.caught_cpointkind()===2 )
			{	//really catching you
				if( $.statemem.stateTU)
				{	$.statemem.stateTU=false;
					/**the immediate `TU` after `state`. the reason for this is a synchronization issue,
						i.e. it must be waited until both catcher and catchee transited to the second frame
						and it is not known at the point of `frame` event, due to different scheduling.
					 */

					//injury
					if( $.frame.D.cpoint.injury)
					{
						if( $.attacked($.catching.hit($.frame.D.cpoint, $, {x:$.ps.x,y:$.ps.y,z:$.ps.z}, null)))
							$.trans.inc_wait(1, 10, 99); //lock until frame transition
					}
					//cover
					var cover = GC.default.cpoint.cover;
					if( $.frame.D.cpoint.cover!==undefined) cover=$.frame.D.cpoint.cover;
					if( cover===0 || cover===10 )
						$.ps.zz=1;
					else
						$.ps.zz=-1;

					if( $.frame.D.cpoint.dircontrol===1)
					{
						if($.con.state.left) $.switch_dir('left');
						if($.con.state.right) $.switch_dir('right');
					}
				}
			}
			break; //TU
			
			case 'post_combo':
				$.statemem.counter--;
				if( $.statemem.counter<=0)
				if( !($.frame.N===122 && $.statemem.attacks===4)) //let it finish the 5th punch
				if( $.frame.N===121 || $.frame.N===122)
				{
					$.catching.caught_release();
					$.trans.frame(999,15);
				}
			break;

			case 'combo':
			switch(K)
			{
				case 'att':
					if( $.frame.N===121)
					{
						var dx = $.con.state.left !== $.con.state.right;
						var dy = $.con.state.up   !== $.con.state.down;
						if( (dx || dy) && $.frame.D.cpoint.taction)
						{
							var tac = $.frame.D.cpoint.taction;
							if( tac<0)
							{	//turn myself around
								$.switch_dir($.ps.dir==='right'?'left':'right'); //toogle dir
								$.trans.frame(-tac, 10);
							}
							else
							{
								$.trans.frame(tac, 10);
							}
							var nextframe=$.data.frame[$.trans.next()];
							$.catching.caught_throw( nextframe.cpoint, $.dirv());
							$.statemem.counter+=10;
						}
						else if($.frame.D.cpoint.aaction)
							$.trans.frame($.frame.D.cpoint.aaction, 10);
						else
							$.trans.frame(122, 10);
					}
				return 1; //always return true so that `att` is not re-fired next frame
				case 'jump':
					if( $.frame.N===121)
					if($.frame.D.cpoint.jaction)
					{
						$.trans.frame($.frame.D.cpoint.jaction, 10);
						return 1;
					}
				break;
			}
			break;
		}},

		'10':function(event,K) //being caught
		{	var $=this;
			switch (event) {

			case 'state_exit':
				$.catching=null;
				$.caught_b_holdpoint=null;
				$.caught_b_cpoint=null;
				$.caught_b_adir=null;
				$.caught_throwz=null;
			break;

			case 'frame':
				$.statemem.frameTU=true;
				$.trans.set_wait(99, 10, 99); //lock until frame transition
			break;

			case 'TU':
				if( $.frame.N===135) //to be lifted against gravity
				{
					$.ps.vy=0;
				}
				
				if( $.caught_cpointkind()===2 &&
				$.catching && $.catching.caught_cpointkind()===1 )
				{	//really being caught
					if( $.statemem.frameTU)
					{	$.statemem.frameTU=false; //the immediate `TU` after `frame`

						var holdpoint=$.caught_b_holdpoint;
						var cpoint=$.caught_b_cpoint;
						var adir=$.caught_b_adir;

						if( cpoint.vaction)
							$.trans.frame(cpoint.vaction, 20);

						if( cpoint.throwvz !== GC.unspecified)
						{	//I am being thrown!
							var dvx=cpoint.throwvx, dvy=cpoint.throwvy, dvz=cpoint.throwvz;
							if( dvx !==0) $.ps.vx = (adir==='right'?1:-1)* dvx;
							if( dvy !==0) $.ps.vy = dvy;
							if( dvz !==0) $.ps.vz = dvz * $.caught_throwz;

							//impulse
							$.mech.set_pos(
								$.ps.x + $.ps.vx*2.5,
								$.ps.y + $.ps.vy*2,
								$.ps.z + $.ps.vz );
						}
						else
						{
							if( cpoint.dircontrol===undefined)
							{
								if( cpoint.cover && cpoint.cover>=10)
									$.switch_dir(adir); //follow dir of catcher
								else //default cpoint cover
									$.switch_dir(adir==='left'?'right':'left'); //face the catcher

								$.mech.coincideXZ(holdpoint,$.mech.make_point($.frame.D.cpoint));
							}
							else
							{
								$.mech.coincideXY(holdpoint,$.mech.make_point($.frame.D.cpoint));
							}
						}
					}
				}
				else
				{
					if( $.catching)
						$.trans.frame(212, 10);
				}
			break;
		}},

		'11':function(event,K) //injured
		{	var $=this;
			switch (event) {
			case 'state_entry':
				$.trans.inc_wait(0, 20); //set lock only
			break;
			case 'frame':
				switch($.frame.N)
				{
					case 221: case 223: case 225:
						$.trans.set_next(999);
					break;
					case 220: case 222: case 224: case 226:
						//$.trans.inc_wait(0, 20, 99); //lock until frame transition
					break;
				}
			break;
		}},

		'12':function(event,K) //falling
		{	var $=this;
			switch (event) {
			case 'frame':
				if( $.effect.dvy <= 0)
				switch ($.frame.N)
				{
					case 180:
						$.trans.set_next(181);
						$.trans.set_wait(util.lookup_abs(GC.fall.wait180,$.effect.dvy));
						break;
					case 181:
						//console.log('y:'+$.ps.y+', vy:'+$.ps.vy+', vx:'+$.ps.vx);
						$.trans.set_next(182);
						var vy = $.ps.vy>0?$.ps.vy:-$.ps.vy;
							 if( 0<=vy && vy<=4)
							$.trans.set_wait(2);
						else if( 4<vy && vy<7)
							$.trans.set_wait(3);
						else if( 7<=vy)
							$.trans.set_wait(4);
						break;
					case 182:
						$.trans.set_next(183);
						break;
					//
					case 186:
						$.trans.set_next(187);
						break;
					case 187:
						$.trans.set_next(188);
						break;
					case 188:
						$.trans.set_next(189);
						break;
				}
				else
				switch ($.frame.N)
				{
					case 180:
						$.trans.set_next(185);
						$.trans.set_wait(1);
						break;
					case 186:
						$.trans.set_next(191);
						break;
				}
			break;

			case 'fell_onto_ground':
			case 'fall_onto_ground':
				if( $.caught_throwinjury>0)
				{
					$.injury($.caught_throwinjury);
					$.caught_throwinjury = null;
				}
				var ps=$.ps;
				//console.log('speed:'+$.mech.speed()+', vx:'+ps.vx+', vy:'+ps.vy);
				if( $.mech.speed() > GC.character.bounceup.limit.xy ||
					ps.vy > GC.character.bounceup.limit.y)
				{
					$.mech.linear_friction(
						util.lookup_abs(GC.character.bounceup.absorb,ps.vx),
						util.lookup_abs(GC.character.bounceup.absorb,ps.vz)
					);
					ps.vy = -GC.character.bounceup.y;
					if( 180 <= $.frame.N && $.frame.N <= 185)
						return 185;
					if( 186 <= $.frame.N && $.frame.N <= 191)
						return 191;
				}
				else
				{
					if( 180 <= $.frame.N && $.frame.N <= 185)
						return 230; //next frame
					if( 186 <= $.frame.N && $.frame.N <= 191)
						return 231;
				}
			break;
			
			case 'combo':
				if( $.frame.N===182 ||
					$.frame.N===188)
				{
					if( K==='jump')
					{
						if( $.frame.N===182)
							$.trans.frame(100);
						else
							$.trans.frame(108);
						if( $.ps.vx)
							$.ps.vx = 5*($.ps.vx>0?1:-1); //magic number
						if( $.ps.vz)
							$.ps.vz = 2*($.ps.vz>0?1:-1); //magic number
						return 1;
					}
				}
			return 1; //always return true so that `jump` is not re-fired next frame
		}},

		'14':function(event,K) //lying
		{	var $=this;
			switch (event) {
			case 'state_entry':
				$.health.fall=0;
				$.health.bdefend=0;
				if( $.health.hp <= 0)
					$.die();
			break;
			case 'state_exit':
				$.effect.timein=0;
				$.effect.timeout=30;
				$.effect.blink=true;
				$.effect.super=true;
			break;
		}},

		'15':function(event,K) //stop_running, crouch, crouch2, dash_attack, light_weapon_thw, heavy_weapon_thw, heavy_stop_run, sky_lgt_wp_thw
		{	var $=this;
			switch (event) {

			case 'frame':
				switch( $.frame.N)
				{
				case 19: //heavy_stop_run
					if( $.hold.obj && $.hold.obj.type==='heavyweapon')
						$.trans.set_next(12);
				break;
				case 215:
					$.trans.inc_wait(-1);
				break;
				case 219: //crouch
					if( !$.id_update('state15_crouch'))
					switch( $.frame.PN) //previous frame number
					{
					case 105: //after rowing
						$.mech.unit_friction();
					break;
					case 216: //after dash
					case 90: case 91: case 92: //dash attack
						$.trans.inc_wait(-1);
					break;
					}
				break;
				case 54: //sky_lgt_wp_thw
					if( $.frame.D.next===999 && $.ps.y<0)
						$.trans.set_next(212); //back to jump
				break;
				}
			break;

			case 'combo':
				if( $.frame.N===215) //only after jumping
				{
					if( K==='def')
					{
						$.trans.frame(102, 10);
						return 1;
					}
					if( K==='jump')
					{
						var dx=0;
						if($.con.state.left)  dx-=1;
						if($.con.state.right) dx+=1;
						if( dx)
						{
							$.trans.frame(213, 10);
							$.switch_dir(dx===1?'right':'left');
						}
						else if( $.ps.vx===0)
						{
							$.trans.inc_wait(2, 10, 99); //lock until frame transition
							$.trans.set_next(210, 10);
						}
						else if( ($.ps.vx>0?1:-1)===$.dirh())
						{
							$.trans.frame(213, 10);
						}
						else
						{
							$.trans.frame(214, 10);
						}
						return 1;
					}
				}
			break;
		}},

		'16':function(event,K) //injured 2 (dance of pain)
		{	var $=this;
			switch (event) {
		}},

		'301':function(event,K) //deep specific
		{	var $=this;
			switch (event) {
			case 'frame_force':
				if( $.frame.N!==290)
					return 1; //disable pre update of force
			break;
			case 'TU':
				$.ps.vz=$.dirv()*($.data.bmp.walking_speedz);
			break;
			case 'hit_stop':
				$.effect_stuck(1,2); //not stuck immediately but next frame (timein=1)
				$.trans.inc_wait(1);
			return 1;
		}},

		'400':function(event,K) //teleport to the nearest enemy
		{	var $=this;
			switch (event) {
			case 'frame':
				var targets = $.match.scene.query(null, $, {
					not_team:$.team,
					type:'character',
					sort:'distance'
				});
				if( targets.length)
				{
					var en = targets[0];
					$.ps.x = en.ps.x - 120*($.dirh());
					$.ps.y = 0;
					$.ps.z = en.ps.z;
				}
			break;
		}},

		'401':function(event,K) //teleport to the furthest teammate
		{	var $=this;
			switch (event) {
			case 'frame':
				var targets = $.match.scene.query(null, $, {
					team:$.team,
					type:'character',
					sort:'distance'
				});
				targets.reverse();
				if( targets.length)
				{
					var en = targets[0];
					$.ps.x = en.ps.x + 60*($.dirh());
					$.ps.y = 0;
					$.ps.z = en.ps.z;
				}
			break;
		}},

		'1700':function(event,K) //heal
		{	var $=this;
			switch (event) {
			case 'frame':
				$.effect.heal = GC.effect.heal_max;
			break;
		}},

		'x':function(event,K)
		{	var $=this;
			switch (event) {
		}}
	};

	var idupdates = //nasty fix (es)
	{
		'default':function()
		{
		},
		'1': function(event,K,tag) //deep
		{
			var $=this;
			switch (event)
			{
			case 'state3_frame':
				switch ($.frame.N)
				{
				case 267:
					$.ps.vy+=1;
				return 1;
				}
			break;
			case 'state15_crouch':
				if( $.frame.PN>=267 && $.frame.PN<=272)
					$.trans.inc_wait(-1);
			break;
			case 'generic_combo':
				if( tag==='hit_Fj')
				{
					if( K==='D>J' || K==='D>AJ')
						$.switch_dir('right');
					else
						$.switch_dir('left');
				}
			break;
			}
		},
		'11': function(event) //davis
		{
			var $=this;
			switch (event)
			{
			case 'state3_hit_stop':
				switch ($.frame.N)
				{
					//to fix many_punch
					case 271: case 276: case 280:
						$.effect_stuck(1,2); //not stuck immediately but next frame (timein=1)
						$.trans.inc_wait(1);
					return 1;
					case 273:
						$.effect_stuck(0,2);
					return 1;
				}
			break;
			case 'state3_frame_force':
				switch ($.frame.N)
				{
					//to fix many_punch
					case 275: case 278: case 279:
						return 1; //disable pre update of force
				}
			break;
			}
		}
	};

	var states_switch_dir= //whether to allow switch dir in each state
	{
		'0': true,
		'1': true,
		'2': false,
		'3': false,
		'4': true,
		'5': false,
		'6': false,
		'7': true,
		'8': false,
		'9': false,
		'10':false,
		'11':false,
		'12':false,
		'13':true,
		'14':false,
		'15':false,
		'16':false
	};

	//inherit livingobject
	function character(config,data,thisID)
	{
		/*(function ()
		{	//a small benchmark for make_array efficiency,
			//for deep and davis,
			//>>time to make_array of 1105 frames:15; x=33720
			//>>time to make_array of 1070 frames:15; x=29960
			var sta=new Date();
			var ccc=0;
			var x=0;
			var tags={'itr':'itr','bdy':'bdy'};
			for( var m=0; m<5; m++)
			for( var j in data.frame)
			{
				ccc++;
				for( var l in tags)
				{
					var obj = Futil.make_array(data.frame[j][l]);
					for( var k=0; k<obj.length; k++)
						x+=obj[k].x;
				}
			}
			var fin=new Date();
			console.log('time to make_array of '+ccc+' frames of '+data.bmp.name+':'+(fin-sta)+'; x='+x);
		}());*/

		var $=this;
		// chain constructor
		livingobject.call(this,config,data,thisID);
		if( typeof idupdates[$.id]==='function')
			$.id_update=idupdates[$.id];
		else
			$.id_update=idupdates['default'];
		$.mech.floor_xbound = true;
		$.con = config.controller;
		$.combo_buffer=
		{
			combo:null,
			timeout:0
		};
		if( $.con)
		{
			function combo_event(kobj)
			{
				var K=kobj.name;
				switch (K)
				{
					case 'left': case 'right':
						if( $.allow_switch_dir)
							$.switch_dir(K);
				}
				if( $.combo_buffer.timeout===GC.combo.timeout &&
					priority[K] < priority[$.combo_buffer.combo])
				{	//combo clash in same frame, higher priority wins
				}
				else
				{
					$.combo_buffer.combo = K;
					$.combo_buffer.timeout = GC.combo.timeout;
				}
			}
			var dec_con = //combo detector
			{
				clear_on_combo: true,
				callback: combo_event //callback function when combo detected
			}
			var combo_list = [
				{ name:'left',	seq:['left'],	clear_on_combo:false},
				{ name:'right',	seq:['right'],	clear_on_combo:false},
				{ name:'up',	seq:['up'],		clear_on_combo:false},
				{ name:'down',	seq:['down'],	clear_on_combo:false},
				{ name:'def',	seq:['def'],	clear_on_combo:false},
				{ name:'jump',	seq:['jump'],	clear_on_combo:false},
				{ name:'att',	seq:['att'],	clear_on_combo:false},
				{ name:'left-left', seq:['left','left'], maxtime:9},
				{ name:'right-right', seq:['right','right'], maxtime:9},
				{ name:'jump-att', seq:['jump','att'], maxtime:0, clear_on_combo:false}
				//plus those defined in Global.combo_list
				//priority grows downward
			];
			combo_list = combo_list.concat(Global.combo_list);
			$.combodec = new Fcombodec($.con, dec_con, combo_list);
			var priority = {};
			for( var i=0; i<combo_list.length; i++)
			{
				priority[combo_list[i].name] = i;
			}
		}
		$.hold=
		{
			obj: null, //holding weapon
		};
		$.health.bdefend=0;
		$.health.fall=0;
		$.health.hp=$.health.hp_full=$.health.hp_bound= $.proper('hp') || GC.default.health.hp_full;
		$.health.hp_lost=0;
		$.health.mp_full= GC.default.health.mp_full;
		$.health.mp= GC.default.health.mp_start;
		$.health.mp_usage=0;
		$.stat=
		{
			attack:0,
			picking:0,
			kill:0
		};
		$.trans.frame=function(next,au)
		{
			if( next===0 || next===999)
			{
				this.set_next(next,au);
				this.set_wait(0,au);
				return;
			}
			var nextF = $.data.frame[next];
			if( !nextF) return;
			//check if mp is enough
			var dmp=0;
			if( nextF.mp>0)
				dmp=nextF.mp%1000;
			if( $.health.mp-dmp>=0)
			{
				this.set_next(next,au);
				this.set_wait(0,au);
			}
		}
		$.setup();
	}
	character.prototype = new livingobject();
	character.prototype.constructor = character;
	character.prototype.type = 'character';
	character.prototype.states = states;
	character.prototype.states_switch_dir = states_switch_dir;
	
	character.prototype.destroy = function()
	{
		var $=this;
		livingobject.prototype.destroy.call(this);
		//(handled by manager.js) remove combo listener to controller
	}
	
	//to emit a combo event
	character.prototype.combo_update = function()
	{		
		/**	different from `state_update`, current state receive the combo event first,
			and only if it returned falsy result, the combo event is passed to the generic state.
			if the combo event is not consumed, it is stored in state memory,
			resulting in 1 combo event being emited every frame until it is being handled or
			overridden by a new combo event.
			a combo event is emitted even when there is no combo, in such case `K=null`
		 */
		var $=this;
		var K = $.combo_buffer.combo;
		if(!K) K=null;
		if( $.combo_buffer.combo==='jump-att') K='jump';

		var tar1=$.states[$.frame.D.state];
		if( tar1) var res1=tar1.call($,'combo',K);
		var tar2=$.states['generic'];
		if(!res1)
		if( tar2) var res2=tar2.call($,'combo',K);
		if( tar1) tar1.call($,'post_combo');
		if( tar2) tar2.call($,'post_combo');
		if( $.combo_buffer.combo==='jump-att')
		{
			if( res1 || res2)
				$.combo_buffer.combo = 'att'; //degrade
		}
		else
			if( res1 || res2 || //do not store if returned true
				K==='left' || K==='right' || K==='up' || K==='down') //dir combos are not persistent
				$.combo_buffer.combo = null;
	}

	/** @protocol caller hits callee
		@param ITR the itr object in data
		@param att reference of attacker
		@param attps position of attacker
		@param rect the hit rectangle where visual effects should appear
	 */
	character.prototype.hit=function(ITR, att, attps, rect)
	{
		var $=this;
		if( $.itr.vrest[att.uid])
			return false;

		var accepthit=false;
		var ef_dvx=0, ef_dvy=0, inj=0;
		if( $.state()===10) //being caught
		{
			if( $.catching.caught_cpointhurtable())
			{
				accepthit=true;
				fall();
			}
			if( $.catching.caught_cpointhurtable()===0 && $.catching!==att)
			{	//I am unhurtable as defined by catcher,
				//and I am hit by attacker other than catcher
			}
			else
			{
				accepthit=true;
				inj += Math.abs(ITR.injury);
				if( ITR.injury>0)
				{
					$.effect_create(0, GC.effect.duration);
					var tar;
					if( ITR.vaction)
						tar=ITR.vaction;
					else
						tar=(attps.x > $.ps.x)===($.ps.dir==='right') ? $.frame.D.cpoint.fronthurtact : $.frame.D.cpoint.backhurtact;
					$.trans.frame(tar, 20);
				}
			}
		}
		else if( $.state()===14)
		{
			//lying
		}
		else
		{
			//kind 0 ITR
			accepthit=true;
			var compen = $.ps.y===0? 1:0; //magic compensation
			ef_dvx = ITR.dvx ? att.dirh()*(ITR.dvx-compen):0;
			ef_dvy = ITR.dvy ? ITR.dvy:0;
			var effectnum = ITR.effect!==undefined?ITR.effect:GC.default.effect.num;

			if( $.state()===7 &&
			    (attps.x > $.ps.x)===($.ps.dir==='right')) //attacked in front
			{
				if( ITR.injury)	inj += GC.defend.injury.factor * ITR.injury;
				if( ITR.bdefend) $.health.bdefend += ITR.bdefend;
				if( $.health.bdefend > GC.defend.break_limit)
				{	//broken defence
					$.trans.frame(112, 20);
				}
				else
				{	//an effective defence
					$.trans.frame(111, 20);
				}
				if( ef_dvx) ef_dvx += (ef_dvx>0?-1:1) * util.lookup_abs(GC.defend.absorb,ef_dvx);
				ef_dvy = 0;
				if( $.health.hp-inj<=0)
					falldown();
			}
			else
			{
				if( $.hold.obj && $.hold.obj.type==='heavyweapon')
					$.drop_weapon(0,0);
				if( ITR.injury)	inj += ITR.injury; //injury
				$.health.bdefend = 45; //lose defend ability immediately
				fall();
			}

			//effect
			var vanish = GC.effect.duration-1;
			switch( $.trans.next())
			{
				case 111: vanish=3; break;
				case 112: vanish=4; break;
			}
			$.effect_create( effectnum, vanish, ef_dvx, ef_dvy);
			$.visualeffect_create( effectnum, rect, (attps.x < $.ps.x), ($.health.fall>0?0:1), true);
		}
		function fall()
		{
			if( ITR.fall!==undefined)
				$.health.fall += ITR.fall;
			else
				$.health.fall += GC.default.fall.value;
			var fall=$.health.fall;
			if ($.ps.y<0 || $.ps.vy<0)
				falldown();
			else if ($.health.hp-inj<=0)
				falldown();
			else if ( 0<fall && fall<=20)
				$.trans.frame(220, 20);
			else if (20<fall && fall<=30)
				$.trans.frame(222, 20);
			else if (30<fall && fall<=40)
				$.trans.frame(224, 20);
			else if (40<fall && fall<=60)
				$.trans.frame(226, 20);
			else if (GC.fall.KO<fall)
				falldown();
		}
		function falldown()
		{
			if( ITR.dvy===undefined) ef_dvy = GC.default.fall.dvy;
			$.health.fall=0;
			$.ps.vy=0;
			var front = (attps.x > $.ps.x)===($.ps.dir==='right'); //attacked in front
				 if( front && ITR.dvx < 0 && ITR.bdefend>=60)
				$.trans.frame(186, 21);
			else if( front)
				$.trans.frame(180, 21);
			else if(!front)
				$.trans.frame(186, 21);

			if( $.proper( $.effect_id(effectnum),'drop_weapon'))
				$.drop_weapon(ef_dvx, ef_dvy);
		}

		$.injury(inj);
		if( accepthit)
		{
			$.itr.attacker = att;
			if( ITR && ITR.vrest)
				$.itr.vrest[att.uid] = ITR.vrest;
		}
		if( accepthit)
			return inj;
		else
			return false;
	}
	character.prototype.injury=function(inj)
	{
		var $=this;
		$.health.hp -= inj;
		$.health.hp_lost += inj;
		$.health.hp_bound -= Math.ceil(inj*1/3);
	}
	character.prototype.heal=function(amount)
	{
		this.effect.heal = amount;
		return true;
	}
	character.prototype.attacked=function(inj)
	{
		if( inj===false)
			return false;
		else if( inj===true)
			return true;
		else
		{	//even if inj===0
			this.stat.attack += inj;
			return true;
		}
	}
	character.prototype.killed=function()
	{
		this.stat.kill++;
	}
	character.prototype.die=function()
	{
		this.itr.attacker.killed();
	}

	//pre interaction is based on `itr` of next frame
	character.prototype.pre_interaction=function()
	{
		var $=this;
		var ITR_LIST=Futil.make_array($.trans.next_frame_D().itr);

		for( var i in ITR_LIST)
		{
			var ITR=ITR_LIST[i]; //the itr tag in data
			//first check for what I have got into intersect with
			var vol=$.mech.volume(ITR);
			vol.zwidth = 0;
			var hit= $.scene.query(vol, $, {tag:'body'});

			switch (ITR.kind)
			{
			case 1: //catch
			case 3: //super catch
				for( var t in hit)
				{
					if( hit[t].team !== $.team) //only catch other teams
					if( hit[t].type==='character') //only catch characters
					if( (ITR.kind===1 && hit[t].state()===16) //you are in dance of pain
					 || (ITR.kind===3)) //super catch
					if( !$.itr.arest)
					{
						var dir = hit[t].caught_a(ITR,$,{x:$.ps.x,y:$.ps.y,z:$.ps.z});
						if( dir)
						{
							$.itr_arest_update(ITR);
							if( dir==='front')
								$.trans.frame(ITR.catchingact[0], 10);
							else
								$.trans.frame(ITR.catchingact[1], 10);
							$.catching=hit[t];
							break;
						}
					}
				}
			break;

			case 7: //pick weapon easy
				if( !$.con.state.att)
					break; //only if att key is down
			case 2: //pick weapon
				if( !$.hold.obj)
				for( var t in hit)
				{
					if(!(ITR.kind===7 && hit[t].type==='heavyweapon')) //kind 7 cannot pick up heavy weapon
					if( hit[t].type==='lightweapon' || hit[t].type==='heavyweapon')
					if( hit[t].pick($))
					{
						$.stat.picking++;
						$.itr_arest_update(ITR);
						if( ITR.kind===2)
						{
							if( hit[t].type==='lightweapon')
								$.trans.frame(115, 10);
							else if( hit[t].type==='heavyweapon')
								$.trans.frame(116, 10);
						}
						$.hold.obj = hit[t];
						break;
					}
				}
			break;
			}
		}
	}

	//post interaction is based on `itr` of current frame
	character.prototype.post_interaction=function()
	{
		var $=this;
		var ITR_LIST=Futil.make_array($.frame.D.itr);

		//TODO
		/*某葉: 基本上會以先填入的itr為優先， 但在範圍重複、同effect的情況下的2組itr，
			攻擊時，會隨機指定其中一個itr的效果。
			（在範圍有部份重複或是完全重複的部份才有隨機效果。）*/

		for( var i in ITR_LIST)
		{
			var ITR=ITR_LIST[i]; //the itr tag in data
			//first check for what I have got into intersect with
			var vol=$.mech.volume(ITR);
			vol.zwidth = 0;
			var hit= $.scene.query(vol, $, {tag:'body'});

			switch (ITR.kind)
			{
			case 0: //normal attack
				for( var t in hit)
				{
					if( !(hit[t].type==='character' && hit[t].team===$.team)) //cannot attack characters of same team
					if( !(hit[t].type!=='character' && hit[t].team===$.team && hit[t].ps.dir===$.ps.dir)) //can only attack objects of same team if head on collide
					if( ITR.effect===undefined || ITR.effect===0 || ITR.effect===1 ||
						(ITR.effect===4 && hit[t].type==='specialattack' && hit[t].state()===3000)) //reflect all specialattacks with state: 3000, weapons fly away, has no influence on other characters
					if( !$.itr.arest)
					if( $.attacked(hit[t].hit(ITR,$,{x:$.ps.x,y:$.ps.y,z:$.ps.z},vol)))
					{	//hit you!
						$.itr_arest_update(ITR);
						//$.log('hit:'+ITR.fall);
						//stalls
						if( $.state_update('hit_stop'))
							; //do nothing
						else
							switch ($.frame.N)
							{
								case 86: case 87: case 91:
									$.effect_stuck(0,2);
									$.trans.inc_wait(1);
									break;
								default:
									$.effect_stuck(0,GC.default.itr.hit_stop);
							}

						//attack one enemy only
						if( ITR.arest) break;
					}
				}
			break;
			}
		}
	}

	character.prototype.wpoint=function()
	{
		var $=this;
		if( $.hold.obj)
		if( $.frame.D.wpoint)
		{
			if( $.frame.D.wpoint.kind===1)
			{
				var act = $.hold.obj.act($, $.frame.D.wpoint, $.mech.make_point($.frame.D.wpoint));
				if( act.thrown)
				{
					$.hold.obj=null;
				}
				if( act.hit!==null && act.hit!==undefined)
				{
					$.itr_arest_update(act);
					//stalls
					$.trans.inc_wait(GC.default.itr.hit_stop, 10);
				}
			}
			else if( $.frame.D.wpoint.kind===3)
			{
				$.drop_weapon();
			}
		}
	}

	character.prototype.opoint=function()
	{
		var $=this;
		if( $.frame.D.opoint)
		{
			var ops = Futil.make_array($.frame.D.opoint);
			for( var i in ops)
				$.match.create_object(ops[i], $);
		}
	}

	character.prototype.drop_weapon=function(dvx,dvy)
	{
		var $=this;
		if( $.hold.obj)
		{
			$.hold.obj.drop(dvx,dvy);
			$.hold.obj=null;
		}
	}

	character.prototype.vol_itr=function(kind)
	{
		var $=this;
		if( $.frame.D.itr)
			return $.mech.body(
				$.frame.D.itr, //make volume from itr
				function (obj) //filter
				{
					return obj.kind==kind; //use type conversion comparison
				}
			);
		else
			return [];
	}

	/** inter-living objects protocol: catch & throw
		for details see http://f-lf2.blogspot.hk/2013/01/inter-living-object-interactions.html
	 */
	character.prototype.caught_a=function(ITR, att, attps)
	{	//this is called when the catcher has an ITR with kind: 1
		var $=this;
		if( $.state()===16) //I am in dance of pain
		{
			if( (attps.x > $.ps.x)===($.ps.dir==='right'))
				$.trans.frame(ITR.caughtact[0], 20);
			else
				$.trans.frame(ITR.caughtact[1], 20);
			$.health.fall=0;
			$.catching=att;
			$.drop_weapon();
			return (attps.x > $.ps.x)===($.ps.dir==='right') ? 'front':'back';
		}
	}
	character.prototype.caught_b=function(holdpoint,cpoint,adir)
	{	//this is called when the catcher has a cpoint with kind: 1
		var $=this;
		$.caught_b_holdpoint=holdpoint;
		$.caught_b_cpoint=cpoint;
		$.caught_b_adir=adir;
		//store this info and process it at TU
	}
	character.prototype.caught_cpointkind=function()
	{
		var $=this;
		return $.frame.D.cpoint ? $.frame.D.cpoint.kind:0;
	}
	character.prototype.caught_cpointhurtable=function()
	{
		var $=this;
		if( $.frame.D.cpoint && $.frame.D.cpoint.hurtable!==undefined)
			return $.frame.D.cpoint.hurtable;
		else
			return GC.default.cpoint.hurtable;
	}
	character.prototype.caught_throw=function(cpoint,throwz)
	{	//I am being thrown
		var $=this;
		if( cpoint.vaction!==undefined)
			$.trans.frame(cpoint.vaction, 20);
		else
			$.trans.frame(GC.default.cpoint.vaction, 20);
		$.caught_throwinjury=cpoint.throwinjury;
		if( $.caught_throwinjury===GC.unspecified)
			$.caught_throwinjury = GC.default.itr.throw_injury;
		$.caught_throwz=throwz;
	}
	character.prototype.caught_release=function()
	{
		var $=this;
		$.catching=0;
		$.trans.frame(181,20);
		$.effect.dvx=3; //magic number
		$.effect.dvy=-3;
		$.effect.timein=-1;
		$.effect.timeout=0;
	}

	return character;
});

/*\
 * weapon
 * 
 * generalization over light and heavy weapons
\*/

define('LF/weapon',['LF/livingobject','LF/global','F.core/util'],
function(livingobject, Global, Futil)
{
var GC=Global.gameplay;

/*\
 * weapon
 [ class ]
 * note that this is a template class
 | var lightweapon = weapon('lightweapon');
 | var heavyweapon = weapon('heavyweapon');
\*/
function weapon(type)
{
	var states=
	{
		'generic':function(event,K)
		{	var $=this;
			switch (event) {
			case 'TU':

				$.interaction();

				switch( $.state())
				{
					case 1001:
					case 2001:
						//I am passive! so I dont need to care states of myself
					break;

					default:
						//dynamics: position, friction, gravity
						$.mech.dynamics();
					break;
				}

				var ps=$.ps;
				if( ps.y===0 && ps.vy>0) //fell onto ground
				{
					if( this.mech.speed() > GC.weapon.bounceup.limit)
					{	//bounceup
						if( $.light)
						{
							ps.vy = 0;
							$.trans.frame(70);
						}
						if( $.heavy)
							ps.vy = GC.weapon.bounceup.speed.y;
						if( ps.vx) ps.vx = (ps.vx>0?1:-1)*GC.weapon.bounceup.speed.x;
						if( ps.vz) ps.vz = (ps.vz>0?1:-1)*GC.weapon.bounceup.speed.z;
						$.health.hp -= $.data.bmp.weapon_drop_hurt;
					}
					else
					{
						$.team=0;
						ps.vy=0; //set to zero
						if( $.light)
							$.trans.frame(70); //just_on_ground
						if( $.heavy)
							$.trans.frame(21); //just_on_ground
					}
					ps.zz=0;
				}
			break;
			case 'die':
				$.trans.frame(1000);
				if( $.data.bmp.weapon_broken_sound)
					$.match.sound.play($.data.bmp.weapon_broken_sound);
				var static_body = $.mech.body($.data.frame[0].bdy)[0];
				for( var i=0; i<8; i++)
					$.match.brokeneffect.create(320,{x:$.ps.x,y:0,z:$.ps.z},$.id,i,static_body);
			break;
		}},

		'1003':function(event,K) //light
		{	var $=this;
			switch (event) {
			case 'frame':
				if( $.frame.N===70) //just_on_ground
				{
					if( !$.frame.D.sound)
						if( $.data.bmp.weapon_drop_sound)
							$.match.sound.play($.data.bmp.weapon_drop_sound);
				}
			break;
		}},

		'1004':function(event,K) //light
		{	var $=this;
			switch (event) {
			case 'frame':
				if( $.frame.N===64) //on ground
					$.team=0; //loses team
			break;
		}},

		'2000':function(event,K) //heavy
		{	var $=this;
			switch (event) {
			case 'frame':
				if( $.frame.N === 21) //just_on_ground
				{
					$.trans.set_next(20);
					if( !$.frame.D.sound)
						if( $.data.bmp.weapon_drop_sound)
							$.match.sound.play($.data.bmp.weapon_drop_sound);
				}
			break;
		}},

		'2004':function(event,K) //heavy
		{	var $=this;
			switch (event) {
			case 'frame':
				if( $.frame.N === 20) //on_ground
					$.team=0;
			break;
		}}
	};

	//inherit livingobject
	function typeweapon(config,data,thisID)
	{
		var $=this;
		// chain constructor
		livingobject.call(this,config,data,thisID);
		for( var i=0; i<$.sp.ani.length; i++)
		{	//fix border issue
			$.sp.ani[i].config.borderleft=1;
			$.sp.ani[i].config.bordertop=0;
			$.sp.ani[i].config.borderright=2;
			$.sp.ani[i].config.borderbottom=2;
		}
		$.hold=
		{
			obj: null, //character who hold me
			pre: null  //previous holder
		};
		$.health.hp = $.data.bmp.weapon_hp;
		$.setup();
	}
	typeweapon.prototype = new livingobject();
	typeweapon.prototype.constructor = typeweapon;
	typeweapon.prototype.light = type==='lightweapon';
	typeweapon.prototype.heavy = type==='heavyweapon';
	typeweapon.prototype.type = type;
	typeweapon.prototype.states = states;

	typeweapon.prototype.interaction=function()
	{
		var $=this;
		var ITR=Futil.make_array($.frame.D.itr);

		if( $.team!==0)
		if(($.heavy) ||
		   ($.light && $.state()===1002))
		for( var j in ITR)
		{	//for each itr tag
			if( ITR[j].kind===0) //kind 0
			{
				var vol=$.mech.volume(ITR[j]);
				vol.zwidth = 0;
				var hit= $.scene.query(vol, $, {tag:'body', not_team:$.team});
				for( var k in hit)
				{	//for each being hit
					var itr_rest;
					if( ITR[j].arest!==undefined || ITR[j].vrest!==undefined)
						itr_rest=ITR[j];
					else
						itr_rest=GC.default.weapon;
					//if( itr_rest.arest) itr_rest.arest+=20; //what is this line for?
					if( !$.itr.arest)
					if( $.attacked(hit[k].hit(ITR[j],$,{x:$.ps.x,y:$.ps.y,z:$.ps.z},vol)))
					{	//hit you!
						var ps=$.ps;
						var vx=(ps.vx===0?0:(ps.vx>0?1:-1));
						if( $.light)
						{
							ps.vx = vx * GC.weapon.hit.vx;
							ps.vy = GC.weapon.hit.vy;
						}
						$.itr_arest_update(ITR);
						//create an effect
						var timeout;
						if( $.light) timeout=2;
						if( $.heavy) timeout=4;
						$.effect.dvx=0;
						$.effect.dvy=0;
						$.effect_stuck(0,timeout);
					}
				}
			}
			//kind 5 is handled in `act()`
		}
	}

	/*\
	 * caller hits callee
	 - ITR the itr object in data
	 - att reference of attacker
	 - attps position of attacker
	 - rect the hit rectangle where visual effects should appear
	\*/
	typeweapon.prototype.hit=function(ITR, att, attps, rect)
	{
		var $=this;
		if( $.hold.obj)
			return false;
		if( $.itr.vrest[att.uid])
			return false;

		var accept=false;
		if( $.light)
		{
			if( $.state()===1002) //throwing
			{
				accept=true;
				if( (att.dirh()>0)!==($.ps.vx>0)) //head-on collision
					$.ps.vx *= GC.weapon.reverse.factor.vx;
				$.ps.vy *= GC.weapon.reverse.factor.vy;
				$.ps.vz *= GC.weapon.reverse.factor.vz;
				$.team = att.team; //change to the attacker's team
			}
			else if( $.state()===1004) //on_ground
			{
				//var asp = att.mech.speed();
				//$.ps.vx= asp* GC.weapon.gain.factor.x * (att.ps.vx>0?1:-1);
				//$.ps.vy= asp* GC.weapon.gain.factor.y;
				if( att.type==='lightweapon' || att.type==='heavyweapon')
				{
					accept=true;
					$.ps.vx= (att.ps.vx?(att.ps.vx>0?1:-1):0)*GC.weapon.bounceup.speed.x;
					$.ps.vz= (att.ps.vz?(att.ps.vz>0?1:-1):0)*GC.weapon.bounceup.speed.z;
				}
			}
		}

		var fall= ITR.fall!==undefined? ITR.fall: GC.default.fall.value;
		if( $.heavy)
		{
			if( $.state()===2004) //on_ground
			{
				accept=true;
				if( fall<30)
					$.effect_create(0, GC.effect.duration);
				else if( fall<GC.fall.KO)
					$.ps.vy= GC.weapon.soft_bounceup.speed.y;
				else
				{
					$.ps.vy= GC.weapon.bounceup.speed.y;
					if( att.ps.vx) $.ps.vx= (att.ps.vx>0?1:-1)*GC.weapon.bounceup.speed.x;
					if( att.ps.vz) $.ps.vz= (att.ps.vz>0?1:-1)*GC.weapon.bounceup.speed.z;
					$.trans.frame(999);
				}
			}
			else if( $.state()===2000) //in_the_sky
			{
				if( fall>=GC.fall.KO)
				{
					accept=true;
					if( (att.dirh()>0)!==($.ps.vx>0)) //head-on collision
						$.ps.vx *= GC.weapon.reverse.factor.vx;
					$.ps.vy *= GC.weapon.reverse.factor.vy;
					$.ps.vz *= GC.weapon.reverse.factor.vz;
					$.team = att.team; //change to the attacker's team
				}
			}
		}
		if( accept)
		{
			$.visualeffect_create( 0, rect, (attps.x < $.ps.x), (fall<GC.fall.KO?1:2));
			if( ITR && ITR.vrest)
				$.itr.vrest[att.uid] = ITR.vrest;
			if( ITR && ITR.injury)
				$.health.hp -= ITR.injury;
			if( $.data.bmp.weapon_hit_sound)
				$.match.sound.play($.data.bmp.weapon_hit_sound);
		}
		return accept;
	}

	/*\
	 * being held in a character's hand
	 - att holder's reference
	 - wpoint data
	 - holdpoint data
	\*/
	typeweapon.prototype.act=function(att,wpoint,holdpoint)
	{
		var $=this;
		var fD = $.frame.D;
		var result={};

		if( $.data.frame[wpoint.weaponact]) //if that frame exists
		{
			$.trans.frame(wpoint.weaponact);
			$.trans.trans(); //update immediately
		}

		if( fD.wpoint && fD.wpoint.kind===2)
		{
			if( wpoint.dvx) $.ps.vx = att.dirh() * wpoint.dvx;
			if( wpoint.dvz) $.ps.vz = att.dirv() * wpoint.dvz;
			if( wpoint.dvy) $.ps.vy = wpoint.dvy;
			if( $.ps.vx || $.ps.vy || $.ps.vz)
			{	//gaining velocity; flying away
				var imx,imy; //impulse
				if( $.light)
				{
					imx=58; imy=-15;
				}
				if( $.heavy)
				{
					imx=48; imy=-40;
				}
				$.mech.set_pos(
					att.ps.x + att.dirh() * imx,
					att.ps.y + imy,
					att.ps.z + $.ps.vz );
				$.ps.zz=1;
				if( $.light)
					$.trans.frame(40);
				if( $.heavy)
					$.trans.frame(999);
				$.trans.trans(); //update immediately
				$.hold.obj=null;
				result.thrown=true;
			}

			if( !result.thrown)
			{
				var wpoint_cover = wpoint.cover!==undefined?wpoint.cover:GC.default.wpoint.cover;
				if( wpoint_cover===1)
					$.ps.zz = -1;
				else
					$.ps.zz = 1;

				$.switch_dir(att.ps.dir);
				$.ps.sz = $.ps.z = att.ps.z;
				$.mech.coincideXY(holdpoint,$.mech.make_point(fD.wpoint));
				$.mech.project();
			}

			if( $.light) //attackable
			{
				if( wpoint.attacking)
				{
					var ITR=Futil.make_array(fD.itr);

					for( var j in ITR)
					{	//for each itr tag
						if( ITR[j].kind===5) //kind 5 only
						{
							var vol=$.mech.volume(ITR[j]);
							vol.zwidth = 0;
							var hit= $.scene.query(vol, [$,att], {tag:'body', not_team:$.team});
							for( var k in hit)
							{	//for each being hit
								if( !att.itr.arest)
								{	//if rest allows
									var citr;
									if( $.data.weapon_strength_list &&
										$.data.weapon_strength_list[wpoint.attacking])
										citr = $.data.weapon_strength_list[wpoint.attacking];
									else
										citr = ITR[j];

									if( $.attacked(hit[k].hit(citr,att,{x:att.ps.x,y:att.ps.y,z:att.ps.z},vol)))
									{	//hit you!
										if( citr.vrest)
											result.vrest = citr.vrest;
										if( citr.arest)
											result.arest = citr.arest;
										result.hit = hit[k].uid;
									}
								}
							}
						}
					}
				}
			}
		}
		if( result.thrown)
			$.shadow.show();
		return result;
	}

	typeweapon.prototype.drop=function(dvx,dvy)
	{
		var $=this;
		$.team=0;
		$.hold.obj=null;
		if( dvx) $.ps.vx=dvx * 0.5; //magic number
		if( dvy) $.ps.vy=dvy * 0.2;
		$.ps.zz=0;
		$.trans.frame(999);
		$.shadow.show();
	}

	typeweapon.prototype.pick=function(att)
	{
		var $=this;
		if( !$.hold.obj)
		{
			$.hold.obj=att;
			$.hold.pre=att;
			$.team=att.team;
			$.shadow.hide();
			return true;
		}
		return false;
	}

	typeweapon.prototype.itr_rest_update=function(obj,uid,ITR) //override livingobject.itr_rest_update
	{
		var $=this;
		var newrest;
		if( ITR.arest)
			newrest = ITR.arest;
		else if( ITR.vrest)
			newrest = ITR.vrest;
		else
			newrest = GC.default.weapon.vrest;
		if( obj.type==='heavyweapon' || obj.type==='lightweapon')
			newrest *= 2; //double the rest time for weapon-weapon hit
		$.itr.vrest[uid] = newrest;
	}

	typeweapon.prototype.vol_itr=function(kind)
	{
		function match_kind(obj)
		{
			return obj.kind==kind; //use type conversion comparison
		}
		var $=this;
		if( $.frame.D.itr)
			return $.mech.body(
				$.frame.D.itr, //make volume from itr
				match_kind //select only matched kind
			);
		else
			return $.mech.body_empty();
	}

	typeweapon.prototype.attacked=function(inj)
	{
		var $=this;
		if( $.hold.pre)
			return $.hold.pre.attacked(inj);
		else
			return inj===false?false:true;
	}

	typeweapon.prototype.killed=function()
	{
		var $=this;
		if( $.hold.pre)
			return $.hold.pre.killed();
	}

	return typeweapon;

} //outer class weapon
return weapon;
});

/*\
 * special attack
\*/

define('LF/specialattack',['LF/livingobject','LF/global','F.core/util'],
function(livingobject, Global, Futil)
{
var GC=Global.gameplay;

	/*\
	 * specialattack
	 [ class ]
	\*/
	var states=
	{
		'generic':function(event,K)
		{	var $=this;
			switch (event) {

			case 'TU':
				$.interaction();
				$.mech.dynamics();
				//	<YinYin> hit_a is the amount of hp that will be taken from a type 3 object they start with 500hp like characters it can only be reset with F7 or negative hits - once the hp reaches 0 the type 3 object will go to frame noted in hit_d - also kind 9 itrs (john shield) deplete hp instantly.
				if( $.frame.D.hit_a)
					$.health.hp -= $.frame.D.hit_a;
			break;

			case 'frame':
				if( $.frame.D.opoint)
					$.match.create_object($.frame.D.opoint, $);
				if( $.frame.D.sound)
					$.match.sound.play($.frame.D.sound);
			break;

			case 'frame_force':
			case 'TU_force':
				if( $.frame.D.hit_j)
				{
					var dvz = $.frame.D.hit_j - 50;
					$.ps.vz = dvz;
				}
			break;

			case 'leaving':
				if( $.bg.leaving($, 200)) //only when leaving far
					$.trans.frame(1000); //destroy
			break;

			case 'die':
				$.trans.frame($.frame.D.hit_d);
			break;
			}
			$.states['300X'].call($, event, K);
		},

		/*	State 300X - Ball States
			descriptions taken from
			http://lf-empire.de/lf2-empire/data-changing/reference-pages/182-states?showall=&start=29
		*/
		'300X':function(event,K)
		{	var $=this;
			switch (event) {
			case 'TU':
				/*	<zort> chasing ball seeks for 72 frames, not counting just after (quantify?) it's launched or deflected. Internally, LF2 keeps a variable keeping track of how long the ball has left to seek, which starts at 500 and decreases by 7 every frame until it reaches 0. while seeking, its maximum x speed is 14, and its x acceleration is 0.7; it can climb or descend, by 1 px/frame; and its maximum z speed is 2.2, with z acceleration .4. when out of seeking juice, its speed is 17. the -7 in the chasing algorithm comes from hit_a: 7.
				*/
				if( $.frame.D.hit_Fa===1 ||
					$.frame.D.hit_Fa===2)
				if( $.health.hp>0)
				{
					$.chase_target();
					var T = $.chasing.target;
					var dx = T.ps.x - $.ps.x,
						dy = T.ps.y - $.ps.y,
						dz = T.ps.z - $.ps.z;
					if( $.ps.vx*(dx>=0?1:-1) < 14)
						$.ps.vx += (dx>=0?1:-1) * 0.7;
					if( $.ps.vz*(dz>=0?1:-1) < 2.2)
						$.ps.vz += (dz>=0?1:-1) * 0.4;
					//$.ps.vy = (dy>=0?1:-1) * 1.0;
					$.switch_dir($.ps.vx>=0?'right':'left');
				}
				if( $.frame.D.hit_Fa===10)
				{
					$.ps.vx = ($.ps.vx>0?1:-1) * 17;
					$.ps.vz = 0;
				}
			break;
		}},

		/*	<zort> you know that when you shoot a ball between john shields it eventually goes out the bottom? that's because when a projectile is spawned it's .3 pixels or whatever below its creator and whenever it bounces off a shield it respawns.
		*/

		//	State 3000 - Ball Flying is the standard state for attacks.  If the ball hits other attacks with this state, it'll go to the hitting frame (10). If it is hit by another ball or a character, it'll go to the the hit frame (20) or rebounding frame (30).
		'3000':function(event, ITR, att, attps, rect)
		{	var $=this;
			switch (event) {
			case 'hit_others':
				$.ps.vx = 0;
				$.trans.frame(10);
			break;
			case 'hit': //hit by others
				if( att.type==='specialattack' && ITR.kind===0)
				{
					$.ps.vx = 0;
					$.trans.frame(20);
					return true;
				}
				if( ITR.kind===0 ||
					ITR.kind===9) //itr:kind:9 can deflect all balls
				{
					$.ps.vx = 0;
					$.team = att.team;
					$.trans.frame(30); //rebound
					$.trans.trans(); $.TU_update(); $.trans.trans(); $.TU_update(); //transit and update immediately
					return true;
				}
			break;
		}},

		//	State 3001 - Ball Flying / Hitting is used in the hitting frames, but you can also use this state directly in the flying frames.  If the ball hits a character while it has state 3001, then it won't go to the hitting frame (20).  It's the same for states 3002 through 3004. 
		'3001':function(event,K)
		{	var $=this;
			switch (event) {
		}},

		'3006':function(event, ITR, att, attps, rect)
		{	var $=this;
			switch (event) {
			case 'hit_others':
				if( att.type==='specialattack' &&
					(att.state()===3005 || att.state()===3006)) //3006 can only be destroyed by 3005 or 3006
				{
					$.trans.frame(10);
					$.ps.vx = 0;
					$.ps.vz = 0;
					return true;
				}
			break;
			case 'hit': //hit by others
				if( ITR.kind===9) //3006 can only be reflected by shield
				{
					$.ps.vx *= -1;
					$.ps.z += 0.3;
					return true;
				}
				if( att.type==='specialattack' &&
					(att.state()===3005 || att.state()===3006)) //3006 can only be destroyed by 3005 or 3006
				{
					$.trans.frame(20);
					$.ps.vx = 0;
					$.ps.vz = 0;
					return true;
				}
				if( att.type==='specialattack' &&
					att.state()===3000)
				{
					$.ps.vx = ($.ps.vx>0?-1:1) * 7; //deflect
					return true;
				}
				if( ITR.kind===0)
				{
					$.ps.vx = ($.ps.vx>0?-1:1) * 1; //deflect a little bit
					if( ITR.bdefend && ITR.bdefend > GC.defend.break_limit)
						$.health.hp = 0;
					return true;
				}
			break;
		}},

		'x':function(event,K)
		{	var $=this;
			switch (event) {
		}}
	};

	//inherit livingobject
	function specialattack(config,data,thisID)
	{
		var $=this;
		// chain constructor
		livingobject.call($,config,data,thisID);
		// constructor
		$.team = config.team;
		$.match = config.match;
		$.health.hp = $.proper('hp') || GC.default.health.hp_full;
		$.mech.mass = 0;
		$.setup();
	}
	specialattack.prototype = new livingobject();
	specialattack.prototype.constructor = specialattack;
	specialattack.prototype.states = states;
	specialattack.prototype.type = 'specialattack';

	specialattack.prototype.init = function(config)
	{
		var pos = config.pos,
			z = config.z,
			parent_dir = config.dir,
			opoint = config.opoint,
			dvz = config.dvz;
		var $=this;
		$.parent = config.parent;
		$.mech.set_pos(0,0,z);
		$.mech.coincideXY(pos,$.mech.make_point($.frame.D,'center'));
		var dir;
		var face = opoint.facing;
		if( face>=20)
			face = face%10;
		if( face===0)
			dir=parent_dir;
		else if( face===1)
			dir=(parent_dir==='right'?'left':'right');
		else if( 2<=face && face<=10)
			dir='right';
		else if(11<=face && face<=19) //adapted standard
			dir='left';
		$.switch_dir(dir);

		$.trans.frame(opoint.action===0?999:opoint.action);
		$.trans.trans();

		$.ps.vx = $.dirh() * opoint.dvx;
		$.ps.vy = opoint.dvy;
		$.ps.vz = dvz;
	}

	specialattack.prototype.interaction=function()
	{
		var $=this;
		var ITR=Futil.make_array($.frame.D.itr);

		if( $.team!==0)
		for( var j in ITR)
		{	//for each itr tag
			var vol=$.mech.volume(ITR[j]);
			vol.zwidth = 0;
			var hit= $.scene.query(vol, $, {tag:'body'});
			for( var k in hit)
			{	//for each being hit
				if( ITR[j].kind===0 ||
					ITR[j].kind===9) //shield
				{
					if( !(hit[k].type==='character' && hit[k].team===$.team)) //cannot attack characters of same team
					if( !(ITR[j].kind===0 && hit[k].type!=='character' && hit[k].team===$.team && hit[k].ps.dir===$.ps.dir)) //kind:0 can only attack objects of same team if head on collide
					if( !$.itr.arest)
					if( $.attacked(hit[k].hit(ITR[j],$,{x:$.ps.x,y:$.ps.y,z:$.ps.z},vol)))
					{	//hit you!
						$.itr_arest_update(ITR);
						$.state_update('hit_others', null, hit[k]);
						if( ITR[j].arest)
							break; //attack one enemy only
						if( hit[k].type==='character' && ITR[j].kind===9)
							//hitting a character will cause shield to disintegrate immediately
							$.health.hp = 0;
					}
				}
				else if( ITR[j].kind===8) //heal
				{
					if( hit[k].type==='character') //only affects character
					if( hit[k].heal(ITR[j].injury))
					{
						$.trans.frame(ITR[j].dvx);
					}
				}
			}
		}
	}

	specialattack.prototype.hit=function(ITR, att, attps, rect)
	{
		var $=this;
		if( $.itr.vrest[att.uid])
			return false;

		if( ITR && ITR.vrest)
			$.itr.vrest[att.uid] = ITR.vrest;
		return $.state_update('hit', ITR, att, attps, rect);
	}

	specialattack.prototype.attacked=function(inj)
	{
		return this.parent.attacked(inj);
	}
	specialattack.prototype.killed=function()
	{
		this.parent.killed();
	}

	specialattack.prototype.chase_target=function()
	{
		//selects a target to chase after
		var $ = this;
		if( $.chasing===undefined)
		{
			$.chasing =
			{
				target: null,
				chased: {},
				query:
				{
					type:'character',
					sort:function(obj)
					{
						var dx = obj.ps.x-$.ps.x;
						var dz = obj.ps.z-$.ps.z;
						var score = Math.sqrt(dx*dx+dz*dz);
						if( $.chasing.chased[obj.uid])
							score += 500 * $.chasing.chased[obj.uid]; //prefer targets that are chased less number of times
						return score;
					}
				}
			}
		}
		$.chasing.query.not_team = $.team;
		var targets = $.match.scene.query(null, $, $.chasing.query);
		var target = targets[0];
		$.chasing.target = target;

		if( $.chasing.chased[target.uid]===undefined)
			$.chasing.chased[target.uid] = 1;
		else
			$.chasing.chased[target.uid]++;
	}

	return specialattack;
});

/*\
 * effect
 * 
 * handle visual effects
 * like blood, fire, etc
\*/

define('LF/effect',['LF/global','LF/sprite','F.core/effects-pool','F.core/util'],
function ( Global, Sprite, Feffects_pool, Futil)
{

/*\
 * effect_set
 [ class ]
 * effect_set is the set for all kinds of effects
 * this is a big manager. there is only 1 instance of effect_set in a match.
 - config (object)
 - DATA (array) of data (object)
 - ID (array) of ID (number)
\*/
function effect_set(config,DATA,ID) //DATA and ID are arrays
{
	DATA=Futil.make_array(DATA);
	ID=Futil.make_array(ID);
	var efs = this.efs = {};
	for( var i=0; i<DATA.length; i++)
	{
		(function(i){
			efs[ID[i]] = new Feffects_pool({
				circular: true,
				init_size: 5,
				batch_size: 5,
				max_size: 30,
				construct: function()
				{
					return new effect(config,DATA[i],ID[i]);
				}
			});
		}(i));
	}
}

effect_set.prototype.destroy=function()
{
	for( var i in this.efs)
	{
		for( var j=0; j<this.efs[i].pool.length; j++)
		{
			this.efs[i].pool[j].destroy();
		}
	}
}

/*\
 * effect_set.create
 [ method ]
 - param (object) `{x,y,z}` position to create the effect
 - id (number) id of the desired effect
 - subnum (number) specify the variant of an effect
\*/
effect_set.prototype.create=function(id,A,B,C,D)
{
	if( this.efs[id])
		this.efs[id].create(A,B,C,D);
}

effect_set.prototype.TU=function()
{
	for( var i in this.efs)
		this.efs[i].call_each('TU');
}

effect_set.prototype.transit=function()
{
}

/*\
 * effect_unit
 [ class ]
 * individual effect
 * 
 * they are like other living objects but much simplier.
 * they are short-lived, `born` as triggered by `effects-pool` and `die` spontaneously
\*/
function effect(config,data,id)
{
	this.dat=data;
	this.match = config.match;
	this.id=id;
	this.sp = new Sprite(this.dat.bmp, config.stage);
	this.sp.hide();
	this.frame;
	this.frameD;
	this.wait=-1;
	this.next;
	this.ps = {
		sx:0,sy:0,sz:0,
		x:0, y:0, z:0,
		vx:0,vy:0,vz:0
	}
	if( data.effect_list)
		this.effect_list=data.effect_list;
	if( config.broken_list)
		this.broken_list=config.broken_list;
	this.width = data.bmp.file[0].w;
}

effect.prototype.destroy=function()
{
	this.sp.destroy();
}

effect.prototype.TU=function()
{
	var $=this;
	var GC=Global.gameplay;
	{	//mechanics
		$.ps.x += $.ps.vx;
		$.ps.y += $.ps.vy;
		$.ps.z += $.ps.vz;
		$.ps.sx = $.ps.x-$.frameD.centerx;
		$.ps.sy = $.ps.y-$.frameD.centery;
		$.ps.sz = $.ps.z;
		$.sp.set_x_y($.ps.sx, $.ps.sy+$.ps.sz);
		$.sp.set_z($.ps.sz+1);
		if( $.ps.y<0)
			$.ps.vy += $.mass * GC.gravity;
		if( $.ps.y>0)
			$.parent.die(this);
	}
	if( $.frame_update)
	{
		$.frame_update=false;
		$.sp.show_pic($.frameD.pic);
		$.wait=$.frameD.wait;
		$.next=$.frameD.next;
		if( $.with_sound)
			if( $.frameD.sound)
				$.match.sound.play($.frameD.sound);
	}
	if( $.wait===0)
	{
		if( $.next===999)
			$.next=0;
		else if( $.next===1000)
		{
			$.parent.die($);
			return ;
		}
		$.frame=$.next;
		$.frameD=$.dat.frame[$.frame];
		$.frame_update=true;
	}
	else
		$.wait--;
}

effect.prototype.transit=function()
{
}

effect.prototype.set_pos=function(x,y,z)
{
}

effect.prototype.born=function(P,N,S,R)
{
	var $=this;
	var sf=0;
	if( $.effect_list)
	{
		if( !N) N=0;
		if( $.effect_list[N])
			sf = $.effect_list[N].frame;
		$.with_sound=S;
		$.mass=0;
	}
	else if( $.broken_list)
	{
		if( $.broken_list[N])
		{
			var slot = S%$.broken_list[N].length;
			sf = $.broken_list[N][slot].frame;
		}
		$.mass=1;
		if( !R) R = {w:50,h:50};
		P.x += $.match.random()*R.w*1.2-$.width;
		$.ps.vy = -1-$.match.random()*R.h*0.25;
	}
	$.frame=sf;
	$.frameD=$.dat.frame[$.frame];
	$.frame_update=true;
	$.ps.x = P.x;
	$.ps.y = P.y;
	$.ps.z = P.z;
	$.sp.show();
}

effect.prototype.die=function()
{
	this.sp.hide();
}

return effect_set;
});

/*\
 * factory.js
 * 
 * object factories
 * in data.js, you define a set of data files, they are actually like product designs.
 * in here factories.js, you define the factories used to manufacture each type of object, living or dead.
 * this abstraction is to allow addition of new object types.
\*/

define('LF/factories',['LF/character','LF/weapon','LF/specialattack','LF/effect'],
function(character,weapon,specialattack,effect)
{
	/** to manufacture an object a factory receives a config, `id` and `data`
	*/
	return {
		character: character,
		lightweapon: weapon('lightweapon'),
		heavyweapon: weapon('heavyweapon'),
		specialattack: specialattack,
		//baseball: baseball,
		//miscell: miscell,
		//drinks: drinks,
		effect: effect
	}
});

/*\
 * math
 * math related functions
\*/

define('F.core/math',[],function(){

math={
/**
math helper functions-----
*/
/*\
 * math.inbetween
 [ method ]
 - x, L, R (number)
 = (boolean) true if x is in between L and R
\*/
inbetween: function (x,L,R)
{
	var l,r;
	if ( L<=R)
	{	l=L;
		r=R;
	}
	else
	{	l=R;
		r=L;
	}
	return x>=l && x<=r;
},
/*\
 * math.round_d2
 [ method ]
 - I (number)
 = (number) round to decimal 2
\*/
round_d2: function (I)
{
	return Math.round(I*100)/100;
},
/*\
 * math.negligible
 [ method ]
 - M (number)
 = (boolean) true if M is very very small, with absolute value smaller than ~0.00000001
\*/
negligible: function (M)
{
	return -0.00000001 < M && M < 0.00000001;
},

/**
curves--------------------
*/

/*\
 * math.bezier2
 [ method ]
 - A, C, B (object) points in `{x,y}`
 * here `C` means the control point
 - steps (number)
 = (object) array of points on curve
\*/
bezier2: function (A,C,B,steps)
{
	var curve = new Array();
	for( var i=0; i<steps; i++)
	{
		curve.push(math.bezier2_step(A,C,B, i,steps));
	}
	curve.push(B);
	return curve;
},
bezier2_step: function (A,C,B, i,steps)
{
	var P={x:0,y:0};
	P.x = getstep(getstep(A.x, C.x, i, steps), getstep(C.x, B.x, i, steps), i, steps);
	P.y = getstep(getstep(A.y, C.y, i, steps), getstep(C.y, B.y, i, steps), i, steps);
	return P;

	function getstep(x1, x2, stepcount, numofsteps)
	{
		return ((numofsteps - stepcount) * x1 + stepcount * x2) / numofsteps;
	}
},

/**
2d vector math--------------
*/
/*\
 * math.add
 [ method ]
 * A+B
 - A, B (object) points in `{x,y}`
 = (object) point in `{x,y}`
\*/
add: function (A,B)
{
	return {x:A.x+B.x, y:A.y+B.y};
},
/*\
 * math.sub
 * A-B
 [ method ]
 - A, B (object) points in `{x,y}`
 = (object) point in `{x,y}`
\*/
sub: function (A,B)
{
	return {x:A.x-B.x, y:A.y-B.y};
},
/*\
 * math.scale
 * A*t
 [ method ]
 - A (object) point
 - t (number)
 = (object) point
\*/
sca: function (A,t)
{
	return {x:A.x*t, y:A.y*t};
},
/*\
 * math.length
 * |A|
 [ method ]
 - A (object) point
 = (number) length
\*/
length: function (A)
{
	return Math.sqrt( A.x*A.x + A.y*A.y );
},
/*\
 * math.distance
 * |AB|
 [ method ]
 - A, B (object) points in `{x,y}`
 = (number) length
\*/
distance: function (p1,p2)
{
	return Math.sqrt( (p2.x-p1.x)*(p2.x-p1.x) + (p2.y-p1.y)*(p2.y-p1.y) );
},
/*\
 * math.negative
 * -A
 [ method ]
 - A (object) point
 = (object) point
\*/
negative: function (A)
{
	return {x:-A.x, y:-A.y};
},
/*\
 * math.normalize
 * A/|A|
 [ method ]
 - A (object) point
 = (object) point
\*/
normalize: function (A)
{
	return math.sca(A, 1/math.length(A));
},
/*\
 * math.perpen
 * perpendicular; anti-clockwise 90 degrees, assume origin in lower left
 [ method ]
 - A (object) point
\*/
perpen: function (A)
{
	return {x:-A.y, y:A.x};
},
/*\
 * math.signed_area
 [ method ]
 - A, B, C (object) points
 = (number) signed area
 * the sign indicate clockwise/anti-clockwise points order
\*/
signed_area: function (p1,p2,p3)
{
	var D = (p2.x-p1.x)*(p3.y-p1.y)-(p3.x-p1.x)*(p2.y-p1.y);
	return D;
},
/*\
 * math.intersect
 * line-line intersection
 [ method ]
 - P1 (object) point on line 1
 - P2 (object) point on line 1
 - P3 (object) point on line 2
 - P4 (object) point on line 2
 = (object) return the intersection point of P1-P2 with P3-P4
 * reference: [http://paulbourke.net/geometry/lineline2d/](http://paulbourke.net/geometry/lineline2d/)
\*/
intersect: function ( P1,P2,P3,P4)
{
	var mua,mub;
	var denom,numera,numerb;

	denom  = (P4.y-P3.y) * (P2.x-P1.x) - (P4.x-P3.x) * (P2.y-P1.y);
	numera = (P4.x-P3.x) * (P1.y-P3.y) - (P4.y-P3.y) * (P1.x-P3.x);
	numerb = (P2.x-P1.x) * (P1.y-P3.y) - (P2.y-P1.y) * (P1.x-P3.x);

	if ( negligible(numera) && negligible(numerb) && negligible(denom)) {
		//meaning the lines coincide
		return { x: (P1.x + P2.x) * 0.5,
			y:  (P1.y + P2.y) * 0.5 };
	}

	if ( negligible(denom)) {
		//meaning lines are parallel
		return { x:0, y:0};
	}

	mua = numera / denom;
	mub = numerb / denom;

	return { x: P1.x + mua * (P2.x - P1.x),
		y:  P1.y + mua * (P2.y - P1.y) };
}

};
return math;
});

/*\
 * collision
 * collision detection function set
 * 
 * all functions return `true` if intersect
 * 
 * [example](../sample/collision.html)
\*/

define('F.core/collision',['F.core/math'], function(Fm)
{

return {

/*\
 * collision.rect
 * rectangle-rectangle intersect test
 [ method ]
 - rect1 (object)
 - rect2 (object) in form of `{left,top,right,bottom}`
\*/
rect: function (rect1,rect2)
{
	if(rect1.bottom < rect2.top)	return false;
	if(rect1.top > rect2.bottom)	return false;
	if(rect1.right < rect2.left)	return false;
	if(rect1.left > rect2.right)	return false;

	return true;
},

//produces less garbage
rect_flat: function (rect1_left,rect1_top,rect1_right,rect1_bottom,
					 rect2_left,rect2_top,rect2_right,rect2_bottom)
{
	if(rect1_bottom < rect2_top)	return false;
	if(rect1_top > rect2_bottom)	return false;
	if(rect1_right < rect2_left)	return false;
	if(rect1_left > rect2_right)	return false;

	return true;
},

normalize_rect: function (rect)
{
	if( rect.left > rect.right && rect.top > rect.bottom)
		return {left:rect.right, right:rect.left,
			top:rect.bottom, bottom:rect.top}
	else if( rect.left > rect.right)
		return {left:rect.right, right:rect.left,
			top:rect.top, bottom:rect.bottom}
	else if( rect.top > rect.bottom)
		return {left:rect.left, right:rect.right,
			top:rect.bottom, bottom:rect.top}
	else
		return rect;
},

/*\
 * collision.tri
 * triangle-triangle intersect test
 [ method ]
 - A,B (array) array of points in form `{x,y}`
\*/
tri: function (A,B)
{
	/*I assume this a fast enough implementation
	  it performs a max. of 18 cross products when the triangles do not intersect.
	    if they do, there may be fewer calculations
	*/
	var aa=Fm.signed_area;
	var I=[];
	//line line intersect tests
	var tested=0;
	I.push( aa(A[0],A[1],B[0])>0, aa(A[0],A[1],B[1])>0,
		aa(A[0],B[0],B[1])>0, aa(A[1],B[0],B[1])>0
	);if(test())return true;
	I.push(         I[1]        , aa(A[0],A[1],B[2])>0,
		aa(A[0],B[1],B[2])>0, aa(A[1],B[1],B[2])>0
	);if(test())return true;
	I.push(         I[0]        ,         I[5]        ,
		aa(A[0],B[0],B[2])>0, aa(A[1],B[0],B[2])>0
	);if(test())return true;
	I.push( aa(A[1],A[2],B[0])>0, aa(A[1],A[2],B[1])>0,
			I[3]        , aa(A[2],B[0],B[1])>0
	);if(test())return true;
	I.push(         I[13]       , aa(A[1],A[2],B[2])>0,
			I[7]        , aa(A[2],B[1],B[2])>0
	);if(test())return true;
	I.push(         I[12]       ,         I[17]       ,
			I[11]       , aa(A[2],B[0],B[2])>0
	);if(test())return true;
	I.push( aa(A[0],A[2],B[0])>0, aa(A[0],A[2],B[1])>0,
			I[2]        ,         I[15]
	);if(test())return true;
	I.push(         I[25]       , aa(A[0],A[2],B[2])>0,
			I[6]        ,         I[19]
	);if(test())return true;
	I.push(         I[24]       ,         I[29]       ,
			I[10]       ,         I[23]
	);if(test())return true;

	function test()
	{
		var i=tested; tested+=4;
		return (I[i]!=I[i+1] && I[i+2]!=I[i+3]);
	}

	//point inside triangle test
	var AinB=[ I[2]==I[6]&&I[6]==!I[10],   //true if A[0] is inside triangle B
		   I[3]==I[7]&&I[7]==!I[11],   //  A[1]
		   I[15]==I[19]&&I[19]==!I[23]]//  A[2]

	var BinA=[ I[0]==I[12]&&I[12]==!I[24], //true if B[0] is inside triangle A
		   I[1]==I[13]&&I[13]==!I[25], //  B[1]
		   I[9]==I[21]&&I[21]==!I[33]];//  B[2]

	if (AinB[0] && AinB[1] && AinB[2])  return true;
	if (BinA[0] && BinA[1] && BinA[2])  return true;

	return false;
	//another possible implementation http://jgt.akpeters.com/papers/Moller97/tritri.html
},

/*\
 * collision.circle
 * circle-circle intersect test
 [ method ]
 - A,B (object) in form `{center,radius}`
 * where center is in form `{x,y}`, radius is a `number`
\*/
circle: function (A,B)
{
	return (Fm.distance(A.center,B.center) <= A.radius+B.radius);
},

/*\
 * collision.line
 * line-line intersect test, true if line AB intersects CD
 [ method ]
 - A,B,C,D (object) in form `{x,y}`
\*/
line: function (A,B,C,D)
{
	var res = (Fm.signed_area(A,B,C)>0 != Fm.signed_area(A,B,D)>0) &&
		  (Fm.signed_area(C,D,A)>0 != Fm.signed_area(C,D,B)>0);
	return res;
},

/*\
 * collision.point_in_rect
 * point in rectangle test
 [ method ]
 - P (object) in form `{x,y}`
 - R (object) in form `{left,top,right,bottom}`
\*/
point_in_rect: function (P,R)
{
	return (Fm.inbetween(P.x,R.left,R.right) && Fm.inbetween(P.y,R.top,R.bottom));
}

}});

/*\
 * scene
 * 
 * scene in F.LF; keeps a list a characters and items
 | vol= //the volume format
 | {
 | 	x, y, z, //the reference point
 | 	vx, vy, w, h, //the volume defined with reference to (x,y,z)
 | 	zwidth	//zwidth spans into the +ve and -ve direction
 | }
\*/

define('LF/scene',['F.core/util','F.core/collision'], function (Futil,Fcollision)
{

function scene (config)
{
	this.live = {}; //list of living objects
	this.uid = 0;
}

scene.prototype.add = function(C)
{
	this.uid++; //starts from 1
	C.uid = this.uid;
	this.live[C.uid]=C;
	return C.uid;
}

scene.prototype.remove = function(C)
{
	var uid = C.uid;
	delete this.live[C.uid];
	C.uid=-1;
	return uid;
}

/*\
 * scene.query
 [ method ]
 - volume (object)
 - exclude (object) or (array of objects)
 - where (object) what to intersect with
 * examples, can mixin the following properties
 | {tag:'body'} intersect with body
 | {tag:'itr:2'} intersect with itr kind:2
 | {type:'character'} with character only
 | {not_team:1} exclude team
 | {filter:function}
 | {sort:function} sort the result (ascending order) using the specified cost function
 = (array) all the objects whose volume intersect with the specified volume
\*/
scene.prototype.query = function(volume, exclude, where)
{
	var result=[];
	var tag=where.tag;
	if(!tag) tag='body';
	var tagvalue=0;
	var tag_split=tag.split(':');
	tag = 'vol_'+tag_split[0];
	tagvalue = tag_split[1];

	for( var i in this.live)
	{
		var excluded=false;
		if( exclude instanceof Array)
		{
			for( var ex=0; ex<exclude.length; ex++)
			{
				if( this.live[i] === exclude[ex])
				{
					excluded=true;
					break;
				}
			}
		}
		else if( exclude)
		{
			if( this.live[i] === exclude)
				excluded=true;
		}
		if( excluded)
			continue;

		if( where.team && this.live[i].team !== where.team)
			continue;

		if( where.not_team && this.live[i].team === where.not_team)
			continue;

		if( where.type && this.live[i].type !== where.type)
			continue;

		if( where.not_type && this.live[i].type === where.not_type)
			continue;

		if( where.filter && !where.filter(this.live[i]))
			continue;

		if( volume===null)
		{
			result.push(this.live[i]);
		}
		else if( this.live[i][tag])
		{
			var vol = this.live[i][tag](tagvalue);
			for( var j=0; j<vol.length; j++)
			{
				if( this.intersect(volume, vol[j]))
				{
					result.push(this.live[i]);
					break;
				}
			}
		}
	}
	if( where.sort)
	{
		if( where.sort==='distance' && !(exclude instanceof Array))
		{	//sort according to distance from exclude
			where.sort = function(obj)
			{
				var dx = obj.ps.x-exclude.ps.x;
				var dz = obj.ps.z-exclude.ps.z;
				return Math.sqrt(dx*dx+dz*dz);
			}
		}
		result.sort(function(a,b){
			return where.sort(a)-where.sort(b); //ascending order
		});
	}
	return result;
}

//return true if volume A and B intersect
scene.prototype.intersect = function(A,B)
{
	//less garbage version
	var A_left=A.x+A.vx, A_top=A.y+A.vy, A_right=A.x+A.vx+A.w, A_bottom=A.y+A.vy+A.h;
	var B_left=B.x+B.vx, B_top=B.y+B.vy, B_right=B.x+B.vx+B.w, B_bottom=B.y+B.vy+B.h;

	return ( Fcollision.rect_flat(
			A_left, A_top, A_right, A_bottom,
			B_left, B_top, B_right, B_bottom) &&
		Fcollision.rect_flat(
			A.z-A.zwidth, 0, A.z+A.zwidth, 1,
			B.z-B.zwidth, 0, B.z+B.zwidth, 1)
		);
}
scene.prototype.intersect_old = function(A,B)
{
	var AV={ left:A.x+A.vx, top:A.y+A.vy, right:A.x+A.vx+A.w, bottom:A.y+A.vy+A.h };
	var BV={ left:B.x+B.vx, top:B.y+B.vy, right:B.x+B.vx+B.w, bottom:B.y+B.vy+B.h };

	return ( Fcollision.rect( AV, BV ) && Fcollision.rect(
	{ left:A.z-A.zwidth, top:0, right:A.z+A.zwidth, bottom:1 },
	{ left:B.z-B.zwidth, top:0, right:B.z+B.zwidth, bottom:1 }
	));
}

//return the distance between object A and B, as measured at center points
scene.prototype.distance=function(A,B)
{
	var dx= (A.x+A.centerx) - (B.x+B.centerx);
	var dy= A.y - B.y;
	var dz= (A.z+A.centery) - (B.z+B.centery);

	return Math.sqrt(dx*dx+dy*dy+dz*dz);
}

return scene;
});

define('LF/background',['F.core/util','LF/sprite-select','F.core/support','LF/global'],function(Futil,Fsprite,Fsupport,global)
{
	var GA = global.application;

	var global_timer, global_timer_children=[];
	function standalone(child)
	{
		global_timer_children.push(child);
		if( !global_timer)
			global_timer = setInterval(function()
			{
				for( var i=0; i<global_timer_children.length; i++)
				{
					global_timer_children[i].TU();
				}
			}, 1000/30); //30 fps
	}

	/* config=
	{
		layers      //layers holder, append bg layers here
		scrollbar   //if true, append scrollbar here
		camerachase:{character:} //camera only chase these characters
		standalone  //no match, background viewer only
		onscroll    //
	}*/
	function background(config,data,id)
	{
		var $=this;
		if( !config)
		{	//create an empty background
			$.id = -1;
			$.name = 'empty background';
			$.width = 1500;
			$.zboundary = [0,300];
			$.height=$.zboundary[1]-$.zboundary[0];
			$.shadow={x:0,y:0,img:''};
			return;
		}
		$.sprite_layer = config.layers;
		$.layers=[];
		$.timed_layers=[];
		$.timer=0;
		$.data = data;
		$.name = data.name.replace(/_/g,' ');
		$.id = id;

		$.zboundary=data.zboundary;
		$.width=data.width;
		$.height=$.zboundary[1]-$.zboundary[0];
		$.shadow={
			x:0,y:0, //offset x,y
			img:data.shadow
		};
		if( Fsprite.renderer==='DOM' && !Fsupport.css3dtransform)
			$.dropframe = 1;
		else
			$.dropframe = 0;

		(function(){
			var sp = new Fsprite({img:data.shadow});
			sp.img[0].addEventListener('load', onload, true);
			function onload()
			{
				$.shadow.x = (this.naturalWidth||this.width)/2;
				$.shadow.y = (this.naturalHeight||this.height)/2;
				sp.img[0].removeEventListener('load', onload, true);
			}
		}());

		if( config.scrollbar)
		{
			var sc = document.createElement('div');
			$.scrollbar=sc;
			sc.className = 'backgroundScroll';
			var child = document.createElement('div');
			child.style.width=$.width+'px';
			child.className = 'backgroundScrollChild';
			sc.appendChild(child);
			config.scrollbar.appendChild(sc);
			sc.onscroll=function()
			{
				if( $.camera_locked)
				{
					$.camerax=sc.scrollLeft;
					$.scroll(sc.scrollLeft);
					if( config.onscroll)
						config.onscroll();
				}
			}
			sc.onmousedown=function()
			{
				$.camera_locked=true;
			}
			sc.onmouseup=function()
			{
				$.camera_locked=false;
			}
			if(!('__proto__' in {}))
			{	//IE 9,10 quirk
				sc.onmousemove=function()
				{
					$.camera_locked=false;
				}
			}
		}

		if( config.camerachase)
		{
			$.char = config.camerachase.character;
			$.camerax = $.width/2;
			$.cami = 0;
		}
		else
			$.camera_locked = true;

		//create layers
		$.layers.push({
			sp: new Fsprite({canvas:config.layers,type:'group'}),
			ratio:1
		});
		$.layers[0].sp.set_w($.width);
		$.layers[0].sp.set_z(3000);
		$.floor = $.layers[0].sp;
		var LAY = Futil.group_elements(data.layer,'width');
		for( var i in LAY)
		{
			var lay=
			{
				sp: new Fsprite({canvas:config.layers,type:'group'}),
				ratio: (parseInt(i)-GA.window.width)/($.width-GA.window.width)
			};
			lay.sp.set_z(-1000+parseInt(i));
			$.layers.push(lay);
			for( var j=0; j<LAY[i].length; j++)
			{
				var dlay = LAY[i][j]; //layer data
				var sp_config;
				if( dlay.rect)
				{
					//if `rect` is defined, `pic` will only be a dummy
					sp_config=
					{
						canvas: lay.sp,
						wh: {w:dlay.width, h:dlay.height}
					}
				}
				else if( dlay.pic)
				{
					sp_config=
					{
						canvas: lay.sp,
						wh: 'fit',
						img: dlay.pic
					}
				}
				var sp;
				if( !dlay.loop && !dlay.tile)
				{	//single item
					sp = new Fsprite(sp_config);
					sp.set_x_y( dlay.x, correct_y(dlay));
					sp.set_z(data.layer.indexOf(dlay));
					if( dlay.rect)
						sp.set_bgcolor(color_conversion(dlay.rect));
				}
				else
				{	//a horizontal array
					sp = new Fsprite({canvas:lay.sp,type:'group'}); //holder
					sp_config.canvas = sp;
					sp.set_x_y(0,0);
					sp.set_z(data.layer.indexOf(dlay));
					var left, right, interval;
					if( dlay.loop)
					{
						left = dlay.x;
						right = dlay.width;
						interval = dlay.loop;
					}
					else if( dlay.tile)
					{
						left = dlay.x-dlay.width*Math.abs(dlay.tile);
						right = dlay.width+dlay.width*Math.abs(dlay.tile);
						interval = dlay.width;
					}
					for( var k=-1, xx=left; xx<right; xx+=interval, k++)
					{
						var spi = new Fsprite(sp_config);
						spi.set_x_y( xx, dlay.y);
						if( dlay.rect)
							spi.set_bgcolor(color_conversion(dlay.rect));
						if( dlay.tile<0)
							spi.set_flipx(!(k%2===0));
					}
				}
				if( dlay.cc)
					$.timed_layers.push({
						sp:sp,
						cc:dlay.cc,
						c1:dlay.c1,
						c2:dlay.c2
					});
			}
		}

		if( config.standalone)
		{
			standalone(this);
			$.carousel = {
				type: config.standalone.carousel,
				dir: 1,
				speed: 5
			};
			$.camera_locked = false;
			$.standalone = config.standalone;
		}

		//a very strange bug for the scene 'HK Coliseum' must be solved by hard coding
		function correct_y(dlay)
		{
			if( data.name==='HK Coliseum')
			{
				if( dlay.pic.indexOf('back1')===-1)
					return dlay.y-8;
				else
					return dlay.y;
			}
			else
				return dlay.y;
		}
	}

	function color_conversion(rect)
	{
		if( typeof rect==='string')
			return rect; //extended standard: CSS color format allowed
		else if( typeof rect==='number')
		{
			var lookup, computed;
			switch (rect)
			{
				case 4706: lookup='rgb(16,79,16)'; break; //lion forest
				case 40179: lookup='rgb(159,163,159)'; break; //HK Coliseum
				case 29582: lookup='rgb(119,119,119)'; break;
				case 37773: lookup='rgb(151,119,111)'; break;
				case 33580: lookup='rgb(135,107,103)'; break;
				case 25356: lookup='rgb(103,103,103)'; break;
				case 21096: lookup='rgb(90,78,75)'; break; //Stanley Prison
				case 37770: lookup='rgb(154,110,90)'; break; //The Great Wall
				case 16835: lookup='rgb(66,56,24)'; break; //Queen's Island
				case 34816: lookup='rgb(143,7,7)'; break; //Forbidden Tower
			}
			var r = (rect>>11<<3),
				g = (rect>>6&31)<<3,
				b = ((rect&31)<<3);
			computed = 'rgb('+
				(r+(r>64||r===0?7:0))+','+
				(g+(g>64||g===0?7:0)+((rect>>5&1)&&g>80?4:0))+','+
				(b+(b>64||b===0?7:0))+
				')';
			if( lookup && computed!==lookup)
				if( 0) //debug info
					console.log('computed:'+computed,'correct:'+lookup);
			if( lookup)
				return lookup;
			else
				return computed;
		}
	}

	background.prototype.destroy=function()
	{
		var $=this;
		if( $.name==='empty background')
			return;
		if ( $.layers)
		for( var i=0; i<$.layers.length; i++)
			$.layers[i].sp.remove();
		if ( $.timed_layers)
		for( var i=0; i<$.timed_layers.length; i++)
			$.timed_layers[i].sp.remove();
		if( $.scrollbar)
			$.scrollbar.parentNode.removeChild($.scrollbar);
		if( $.sprite_layer)
			$.sprite_layer.remove_all();
	}

	//return true if the moving object is leaving the scene
	background.prototype.leaving=function(o, xt)
	{
		var $=this;
		if( !xt)
			xt = 0;
		var nx=o.ps.sx+o.ps.vx,
			ny=o.ps.sy+o.ps.vy;
		return (nx+o.sp.width<0-xt || nx>$.width+xt || ny<-600 || ny>100);
	}

	//get an absolute position using a ratio, e.g. get_pos(0.5,0.5) is exactly the mid point
	background.prototype.get_pos=function(rx,rz)
	{
		var $=this;
		return { x:$.width*rx, y:0, z:$.zboundary[0]+$.height*rz};
	}

	background.prototype.scroll=function(X)
	{
		var $=this;
		for( var i=0; i<$.layers.length; i++)
			$.layers[i].sp.set_x_y(round(-(X*$.layers[i].ratio)),0);
		function round(x)
		{
			if( i===0)
				return x|0;
			else
				return x;
		}
	}

	var screenW=GA.window.width,
		halfW  =GA.window.width/2;
	background.prototype.TU=function()
	{
		var $=this;
		//camera movement
		if( !$.camera_locked)
		{
			if( !$.carousel)
			{	//camera chase
				if( $.cami++%($.dropframe+1)!==0)
					return;
				/// algorithm by Azriel
				/// http://www.lf-empire.de/forum/archive/index.php/thread-4597.html
				var avgX=0,
					facing=0,
					numPlayers=0;
				for( var i in $.char)
				{
					avgX+= $.char[i].ps.x;
					facing+= $.char[i].dirh();
					numPlayers++;
				}
				if( numPlayers>0)
					avgX/=numPlayers;
				//var xLimit= (facing*screenW)/(numPlayers*6) - (halfW + avgX);
				//  his original equation has one error, it should be 24 regardless of number of players
				var xLimit= (facing*screenW/24)+(avgX-halfW);
				if( xLimit < 0) xLimit=0;
				if( xLimit > $.width-screenW) xLimit = $.width-screenW;
				var spdX = (xLimit - $.camerax) * GA.camera.speed_factor * ($.dropframe+1);
				if( spdX!==0)
				{
					if( -0.05<spdX && spdX<0.05)
						$.camerax = xLimit;
					else
						$.camerax = $.camerax + spdX;
					$.scroll($.camerax);
					if( $.scrollbar)
						$.scrollbar.scrollLeft = Math.round($.camerax);
				}
			}
			else if( $.carousel.type==='linear')
			{
				var lastscroll = $.scrollbar.scrollLeft;
				$.scrollbar.scrollLeft += $.carousel.speed*$.carousel.dir;
				if( lastscroll === $.scrollbar.scrollLeft)
					$.carousel.dir *= -1;
				$.scroll($.scrollbar.scrollLeft);
			}
		}
		//layers animation
		for( var i=0; i<$.timed_layers.length; i++)
		{
			var lay = $.timed_layers[i];
			var frame = $.timer%lay.cc;
			if( frame>=lay.c1 && frame<=lay.c2)
				lay.sp.show();
			else
				lay.sp.hide();
		}
		if( $.standalone)
			$.standalone.canvas.render();
		$.timer++;
	}

	return background;
});

/** jsgamesoup
	A Free Software framework for making games using Javascript and open web technologies. Runs on Firefox (Gecko), Safari/Chrome (WebKit), Internet Explorer 6+, and Android + iOS browsers.
	Homepage, documentation, demos, at http://jsgamesoup.net/
*/
/**
        @class A fast, deterministic, seedable random number generator.
        @description Unlike the native random number generator built into most browsers, this one is deterministic, and so it will produce the same sequence of outputs each time it is given the same seed. It is based on George Marsaglia's MWC algorithm from the v8 Javascript engine.
*/

define('LF/third_party/random',[],function()
{
function SeedableRandom() {
        /**
                Get the next random number between 0 and 1 in the current sequence.
        */
        this.next = function next() {
                // Random number generator using George Marsaglia's MWC algorithm.
                // Got this from the v8 js engine

                // don't let them get stuck
                if (this.x == 0) this.x == -1;
                if (this.y == 0) this.y == -1;

                // Mix the bits.
                this.x = this.nextX();
                this.y = this.nextY();
                return ((this.x << 16) + (this.y & 0xFFFF)) / 0xFFFFFFFF + 0.5;
        }

        this.nextX = function() {
                return 36969 * (this.x & 0xFFFF) + (this.x >> 16);
        }

        this.nextY = function() {
                return 18273 * (this.y & 0xFFFF) + (this.y >> 16);
        }

        /**
                Get the next random integer in the current sequence.
                @param a The lower bound of integers (inclusive).
                @param gs The upper bound of integers (exclusive).
        */
        this.nextInt = function nextInt(a, b) {
                if (!b) {
                        a = 0;
                        b = 0xFFFFFFFF;
                }
                // fetch an integer between a and b inclusive
                return Math.floor(this.next() * (b - a)) + a;
        }

        /**
                Seed the random number generator. The same seed will always yield the same sequence. Seed with the current time if you want it to vary each time.
                @param x The seed.
        */
        this.seed = function(x) {
                this.x = x * 3253;
                this.y = this.nextX();
        }

        /**
                Seed the random number generator with a two dimensional seed.
                @param x First seed.
                @param y Second seed.
        */
        this.seed2d = function seed(x, y) {
                this.x = x * 2549 + y * 3571;
                this.y = y * 2549 + x * 3571;
        }

        /**
                Seed the random number generator with a three dimensional seed.
                @param x First seed.
                @param y Second seed.
                @param z Third seed.
        */
        this.seed3d = function seed(x, y, z) {
                this.x = x * 2549 + y * 3571 + z * 3253;
                this.y = x * 3253 + y * 2549 + z * 3571;
        }

        /**
				Seed by the current time, returning the seed
        */
        this.seed_bytime = function()
        {
			var val = (new Date()).getTime();
			this.seed(val);
			return val;
		}
}
return SeedableRandom;
});

/*\
 * match
 * a match hosts a game.
 * a match is a generalization above game modes (e.g. VSmode, stagemode, battlemode)
\*/

define('LF/match',['F.core/util','F.core/controller','LF/sprite-select',
'LF/network','LF/factories','LF/scene','LF/background','LF/AI','LF/third_party/random','LF/util',
'LF/global'],
function(Futil,Fcontroller,Fsprite,
network,factory,Scene,Background,AI,Random,util,
Global)
{
	var GA=Global.application;
	/*\
	 * match
	 [ class ]
	 |	config =
	 |	{
	 |  manager,//the game manager
	 |	state,  //the state machine handling various events in a match
	 |	package	//the content package
	 |	}
	\*/
	function match(config)
	{
		var $=this;
		$.manager = config.manager;
		$.state = config.state;
		$.data = config.package.data;
		$.sound = config.manager.sound;
		$.spec = $.data.properties.data;
		$.time;
	}

	match.prototype.create=function(setting)
	{
		var $=this;
		var object_ids=[],
			AI_ids=[];
		for( var i=0; i<setting.player.length; i++)
		{
			//(lazy) now load all characters and associated data files
			object_ids.push(setting.player[i].id);
			object_ids = object_ids.concat(Futil.extract_array(util.select_from($.data.object,{id:setting.player[i].id}).pack,'id').id);
			if( setting.player[i].controller.type==='AIscript')
				AI_ids.push(setting.player[i].controller.id);
		}
		if( !setting.set) setting.set={};

		$.gameover_state = false;
		$.randomseed = $.new_randomseed();
		$.create_scenegraph();
		$.control = $.create_controller(setting.control);
		$.functionkey_control = setting.control;
		if( $.functionkey_control &&
			$.functionkey_control.restart)
			$.functionkey_control.restart();
		if( $.manager.panel_layer)
		{
			$.panel=[];
			for( var i=0; i<8; i++) $.panel[i]={};
		}
		$.overlay_message('loading');
		$.tasks = []; //pending tasks
		$.AIscript = [];
		$.manager.canvas.render();

		var already = false;
		this.data.load({
			'object':object_ids,
			'background':setting.background?[setting.background.id]:[],
			'AI':AI_ids
		},function()
		{	//when all necessary data files are loaded
			$.create_background(setting.background);
			$.create_effects();
			if( setting.player)
				$.create_characters(setting.player);
			if( setting.set.weapon)
				$.drop_weapons(setting.set.weapon);

			Fsprite.masterconfig_set('onready',onready);
			setTimeout(function(){onready()},8000); //assume it is ready after 8 seconds
		});
		function onready()
		{
			if( !already)
			{	//all loading finished
				already = true;
				$.manager.overlay_mess.hide();
				$.manager.summary.hide();
				if( setting.set.demo_mode)
				{
					$.demo_mode=true;
					$.overlay_message('demo');
				}
				$.create_timer();
			}
		}
	}

	match.prototype.destroy=function()
	{
		var $=this;
		$.time.paused=true;
		$.destroyed=true;
		network.clearInterval($.time.timer);

		//destroy all objects
		$.for_all('destroy');
		$.background.destroy();
		if( $.panel)
		for( var i=0; i<$.panel.length; i++)
		{
			if( $.panel[i].hp)
			{
				$.panel[i].hp.remove();
				$.panel[i].hp_bound.remove();
				$.panel[i].mp.remove();
				$.panel[i].mp_bound.remove();
				$.panel[i].spic.remove();
			}
		}
	}

	match.prototype.log=function(mes)
	{
		console.log(this.time.t+': '+mes);
	}

	match.prototype.create_object=function(opoint, parent)
	{
		var $=this;
		$.tasks.push({
			task: 'create_object',
			parent: parent,
			opoint: opoint,
			team: parent.team,
			pos: parent.mech.make_point(opoint),
			z: parent.ps.z,
			dir: parent.ps.dir,
			dvz: parent.dirv()*2
		});
	}

	match.prototype.destroy_object=function(obj)
	{
		var $=this;
		$.tasks.push({
			task: 'destroy_object',
			obj: obj
		});
	}

	//all methods below are considered private

	match.prototype.create_scenegraph=function()
	{
		var $=this;
		$.scene = new Scene();
		for( var objecttype in factory)
			$[objecttype] = {};
	}

	match.prototype.create_timer=function()
	{
		var $=this;
		$.time =
		{
			t:0,
			paused: false,
			timer: null,
			$fps: util.div('fps')
		};
		if( !$.time.$fps) $.calculate_fps = function(){};
		$.time.timer = network.setInterval( function(){return $.frame();}, 1000/30);
	}

	match.prototype.frame=function()
	{
		var $=this;
		if( $.control)
			$.control.fetch();
		if( !$.time.paused || $.time.paused==='F2')
		{
			for( var i in $.character)
			{
				$.character[i].con.fetch();
				$.character[i].combodec.frame();
			}
			if( $.destroyed)
				return;
			$.TU_trans();
			if( $.time.t===0)
				$.match_event('start');
			$.time.t++;
			$.manager.canvas.render();
			$.calculate_fps();
			
			if( $.time.paused==='F2')
				$.time.paused=true;
		}
		else
		{
			if( $.time.$fps)
				$.time.$fps.value='paused';
		}
		return $.game_state();
	}
	
	match.prototype.game_state=function()
	{
		var $=this;
		var d={};
		d.time = $.time.t;
		for( var i in $.character)
		{
			var c = $.character[i];
			d[i] = [c.ps.x,c.ps.y,c.ps.z,c.health.hp,c.health.mp];
		}
		return d;
	}
	
	match.prototype.TU_trans=function()
	{
		var $=this;
		$.emit_event('transit');
		$.process_tasks();
		$.emit_event('TU');
		$.background.TU();
		$.sound.TU();
		$.show_hp();
		$.check_gameover();
		var AI_frameskip = 3; //AI script runs at a lower framerate, and is still very reactive
		if( $.time.t%AI_frameskip===0)
			for( var i=0; i<$.AIscript.length; i++)
				$.AIscript[i].TU();
	}

	match.prototype.match_event=function(E)
	{
		var $=this;
		if( $.state && $.state.event) $.state.event.call(this, E);
	}

	match.prototype.emit_event=function(E)
	{
		var $=this;
		$.match_event(E);
		$.for_all(E);
	}

	match.prototype.for_all=function(oper)
	{
		var $=this;
		for( var objecttype in factory)
			for( var i in $[objecttype])
				$[objecttype][i][oper]();
	}

	match.prototype.process_tasks=function()
	{
		var $=this;
		for( var i=0; i<$.tasks.length; i++)
			$.process_task($.tasks[i]);
		$.tasks.length=0;
	}
	match.prototype.process_task=function(T)
	{
		var $=this;
		switch (T.task)
		{
		case 'create_object':
			if( T.opoint.kind===1)
			{
				if( T.opoint.oid)
				{
					var OBJ = util.select_from($.data.object,{id:T.opoint.oid});
					if(!OBJ)
					{
						console.log('Object', T.opoint.oid, 'not exists');
						break;
					}
					var config =
					{
						match: $,
						team: T.team
					};
					var obj = new factory[OBJ.type](config, OBJ.data, T.opoint.oid);
					obj.init(T);
					var uid = $.scene.add(obj);
					$[obj.type][uid] = obj;
				}
			}
		break;
		case 'destroy_object':
			var obj = T.obj;
			obj.destroy();
			var uid = $.scene.remove(obj);
			delete $[obj.type][uid];
		break;
		}
	}

	match.prototype.calculate_fps=function()
	{
		var $=this;
		var mul = 10;
		if( $.time.t%mul===0)
		{
			var ot=$.time.time;
			$.time.time = new Date().getTime();
			var diff = $.time.time-ot;
			$.time.$fps.value = Math.round(1000/diff*mul)+'fps';
		}
	}

	match.prototype.create_characters=function(players)
	{
		var $=this;
		var char_config =
		{
			match: $,
			controller: null,
			team: 0
		};
		for( var i=0; i<players.length; i++)
		{
			var player = players[i];
			var player_obj = util.select_from($.data.object,{id:player.id});
			var pdata = player_obj.data;
			preload_pack_images(player_obj);
			var controller = setup_controller(player);
			//create character
			var char = new factory.character(char_config, pdata, player.id);
			if( controller.type==='AIcontroller')
			{
				var AIcontroller = util.select_from($.data.AI,{id:player.controller.id}).data;
				$.AIscript.push(new AIcontroller(char,$,controller));
			}
			//positioning
			var pos=$.background.get_pos($.random(),$.random());
			char.set_pos( pos.x, pos.y, pos.z);
			var uid = $.scene.add(char);
			$.character[uid] = char;
			//pane
			if( $.panel)
				create_pane(i);
		}
		function preload_pack_images(char)
		{
			for( var j=0; j<char.pack.length; j++)
			{
				var obj = char.pack[j].data;
				if( obj.bmp && obj.bmp.file)
				{
					for( var k=0; k<obj.bmp.file.length; k++)
					{
						var file = obj.bmp.file[k];
						for( var m in file)
						{
							if( typeof file[m]==='string' && m.indexOf('file')===0)
							{
								Fsprite.preload_image(file[m]);
							}
						}
					}
				}
			}
		}
		function setup_controller(player)
		{
			var controller;
			switch (player.controller.type)
			{
				case 'AIscript':
					controller = new AI.controller();
				break;
				default:
					controller = player.controller;
					controller.child.push($);
			}
			char_config.controller = controller;
			char_config.team = player.team;
			controller.sync = true;
			return controller;
		}
		function create_pane(i)
		{
			var X = $.data.UI.data.panel.pane_width*(i%4),
				Y = $.data.UI.data.panel.pane_height*Math.floor(i/4);
			var spic = new Fsprite({
				canvas: $.manager.panel_layer,
				img: pdata.bmp.small,
				xy: {x:X+$.data.UI.data.panel.x, y:Y+$.data.UI.data.panel.y},
				wh: 'fit'
			});
			$.panel[i].uid = uid;
			$.panel[i].name = player.name;
			$.panel[i].spic = spic;
			$.panel[i].hp_bound = new Fsprite({canvas: $.manager.panel_layer});
			$.panel[i].hp_bound.set_x_y( X+$.data.UI.data.panel.hpx, Y+$.data.UI.data.panel.hpy);
			$.panel[i].hp_bound.set_w_h( $.data.UI.data.panel.hpw, $.data.UI.data.panel.hph);
			$.panel[i].hp_bound.set_bgcolor( $.data.UI.data.panel.hp_dark);
			$.panel[i].hp = new Fsprite({canvas: $.manager.panel_layer});
			$.panel[i].hp.set_x_y( X+$.data.UI.data.panel.hpx, Y+$.data.UI.data.panel.hpy);
			$.panel[i].hp.set_w_h( $.data.UI.data.panel.hpw, $.data.UI.data.panel.hph);
			$.panel[i].hp.set_bgcolor( $.data.UI.data.panel.hp_bright);
			$.panel[i].mp_bound = new Fsprite({canvas: $.manager.panel_layer});
			$.panel[i].mp_bound.set_x_y( X+$.data.UI.data.panel.mpx, Y+$.data.UI.data.panel.mpy);
			$.panel[i].mp_bound.set_w_h( $.data.UI.data.panel.mpw, $.data.UI.data.panel.mph);
			$.panel[i].mp_bound.set_bgcolor( $.data.UI.data.panel.mp_dark);
			$.panel[i].mp = new Fsprite({canvas: $.manager.panel_layer});
			$.panel[i].mp.set_x_y( X+$.data.UI.data.panel.mpx, Y+$.data.UI.data.panel.mpy);
			$.panel[i].mp.set_w_h( $.data.UI.data.panel.mpw, $.data.UI.data.panel.mph);
			$.panel[i].mp.set_bgcolor( $.data.UI.data.panel.mp_bright);
		}
	}

	match.prototype.show_hp=function()
	{
		var $=this;
		for( var i=0; i<$.panel.length; i++)
		{
			if( $.panel[i].uid!==undefined)
			{
				var ch = $.character[$.panel[i].uid],
					hp = Math.floor(ch.health.hp/ch.health.hp_full*$.data.UI.data.panel.hpw);
					hp_bound = Math.floor(ch.health.hp_bound/ch.health.hp_full*$.data.UI.data.panel.hpw);
				if( hp<0) hp=0;
				if( hp_bound<0) hp_bound=0;
				$.panel[i].hp.set_w(hp);
				$.panel[i].hp_bound.set_w(hp_bound);
				$.panel[i].mp.set_w(Math.floor(ch.health.mp/ch.health.mp_full*$.data.UI.data.panel.mpw));
				if( ch.effect.heal && ch.effect.heal>0 && $.time.t%3==0)
					$.panel[i].hp.set_bgcolor( $.data.UI.data.panel.hp_light);
				else
					$.panel[i].hp.set_bgcolor( $.data.UI.data.panel.hp_bright);
			}
		}
	}

	match.prototype.check_gameover=function()
	{
		var $=this;
		var teams={};
		for( var i=0; i<$.panel.length; i++)
		{
			if( $.panel[i].uid!==undefined)
			{
				var ch = $.character[$.panel[i].uid];
				if( ch.health.hp>0)
					teams[ch.team] = true;
			}
		}
		if( Object.keys(teams).length<2)
		{
			if( !$.gameover_state)
				$.gameover_state = $.time.t;
			else
				if( $.time.t == $.gameover_state + 30)
					$.gameover();
		}
		else
		{
			if( $.gameover_state)
			{
				$.gameover_state = false;
				$.gameover();
			}
		}
	}

	match.prototype.gameover=function()
	{
		var $=this;
		if( $.gameover_state)
		{
			var info = [];
			var teams = {};
			for( var i=0; i<$.panel.length; i++)
			{
				if( $.panel[i].uid!==undefined)
				{
					var ch = $.character[$.panel[i].uid];
					if( ch.health.hp>0)
						teams[ch.team] = true;
				}
			}
			for( var i=0; i<$.panel.length; i++)
			{
				if( $.panel[i].uid!==undefined)
				{
					var ch = $.character[$.panel[i].uid];
					var alive = ch.health.hp>0;
					var win = teams[ch.team];
					//[ Icon, Name, Kill, Attack, HP Lost, MP Usage, Picking, Status ]
					info.push([ch.data.bmp.small, $.panel[i].name, ch.stat.kill, ch.stat.attack, ch.health.hp_lost, ch.health.mp_usage, ch.stat.picking, (win?'Win':'Lose')+' ('+(alive?'Alive':'Dead')+')']);
				}
			}
			$.manager.summary.set_info(info);
			$.manager.summary.set_time('01:23');
			$.manager.summary.show();
			$.manager.sound.play('1/m_end');
		}
		else
		{
			$.manager.summary.hide();
		}
	}

	match.prototype.key=function(K,down)
	{
		var $=this;
		if( $.gameover_state)
		{
			if( down)
			if( $.time.t > $.gameover_state + 60)
			if( K==='att' || K==='jump')
				$.F4();
		}
	}

	match.prototype.create_effects=function(config)
	{
		var $=this;
		var effects = Futil.extract_array( util.selectA_from($.data.object,{type:'effect'}), ['data','id']);
		var broken  = util.select_from($.data.object,{type:'broken'});
		var broken_list = Futil.group_elements( broken.data.broken_list, 'id');
		$.visualeffect = $.effect[0] = new factory.effect( {match:$, stage:$.stage}, effects.data, effects.id);
		$.brokeneffect = $.effect[1] = new factory.effect( {match:$, stage:$.stage, broken_list:broken_list}, broken.data,  broken.id);
	}

	match.prototype.drop_weapons=function(setup)
	{
		var $=this;
		var num=5;
		var weapon_list=
		 util.selectA_from($.data.object,{type:'lightweapon'}).concat
		(util.selectA_from($.data.object,{type:'heavyweapon'}));
		for( var i=0; i<num; i++)
		{
			var O=$.background.get_pos($.random(),$.random());
			O.y=-800;
			$.create_weapon(weapon_list[Math.floor(weapon_list.length*$.random())].id, O);
		}
	}

	match.prototype.create_weapon=function(id,pos)
	{
		var $=this;
		var weapon= id<150 ? 'lightweapon':'heavyweapon';
		var wea_config=
		{
			match: $
		};
		var object = util.select_from($.data.object,{id:id});
		var wea = new factory[weapon]( wea_config, object.data, object.id);
		wea.set_pos(pos.x,pos.y,pos.z);
		var uid = $.scene.add(wea);
		$[weapon][uid] = wea;
	}

	match.prototype.create_background=function(bg)
	{
		var $=this;
		if( bg)
		{
			var bgdata = util.select_from($.data.background,{id:bg.id}).data;
			$.background = new Background({
				layers: $.manager.background_layer,
				scrollbar: $.manager.gameplay,
				camerachase: {character:$.character},
				onscroll: function(){ $.manager.canvas.render()}
			},bgdata,bg.id);
			$.stage = $.background.floor;
		}
		else
		{
			$.background = new Background(null); //create an empty background
			$.stage = $.manager.canvas;
		}
	}

	match.prototype.F4=function()
	{
		var $=this;
		$.destroy();
		$.manager.match_end();
	}

	match.prototype.F7=function()
	{
		var $=this;
		for( var i in $.character)
		{
			var ch = $.character[i];
			ch.health.hp=ch.health.hp_full=ch.health.hp_bound= ch.proper('hp') || Global.gameplay.default.health.hp_full;
			ch.health.mp=ch.health.mp_full;
		}
	}

	match.prototype.new_randomseed=function()
	{
		var rand = new Random();
		rand.seed(897645324);
		return rand;
	}

	match.prototype.random=function()
	{
		return this.randomseed.next();
	}

	match.prototype.overlay_message=function(mess)
	{
		var $=this;
		$.manager.overlay_mess.show();
		var item = $.data.UI.data.message_overlay[mess];
		$.manager.overlay_mess.set_img_x_y(-item[0],-item[1]);
		$.manager.overlay_mess.set_w_h(item[2],item[3]);
	}

	match.prototype.create_controller=function(funcon)
	{
		var $=this;
		function show_pause()
		{
			if( !$) return;
			if( $.time.paused)
				$.overlay_message('pause');
		}
		if( funcon)
		{
			funcon.sync=true;
			funcon.child.push ({
				key: function(I,down)
				{
					var opaused = $.time.paused; //original pause state
					if( down)
					{
						switch (I)
						{
							case 'F1':
								if( !$.time.paused)
									$.time.paused=true;
								else
									$.time.paused=false;
							break;

							case 'F2':
								$.time.paused='F2';
							break;

							case 'esc':
							case 'F4':
								$.F4();
							break;

							case 'F6':
								if( !$.F6_mode)
									$.F6_mode=true;
								else
									$.F6_mode=false;
							break;

							case 'F7':
								$.F7();
							break;
						}
						if( (I==='F1' || I==='F2') && $.time.paused)
						{
							$.manager.overlay_mess.hide();
							setTimeout(show_pause,4); //so that the 'pause' message blinks
						}
						else if( !$.time.paused)
						{
							$.manager.overlay_mess.hide();
						}
						if( opaused !== $.time.paused)
						{	//state change
							if( $.time.paused)
							{
								if( funcon.paused)
									funcon.paused(true);
							}
							else
							{
								if( funcon.paused)
									funcon.paused(false);
							}
						}
					}
				}
			});
			return funcon;
		}
	}

	return match;
});

/*\
 * touchcontroller
 * 
 * touch controller for LF2
\*/
define('LF/touchcontroller',['LF/util'],function(util)
{
	var controllers=[];
	var touches=[], eventtype;
	function touch_fun(event)
	{
		if( !TC.enabled) return;
		eventtype = event.type;
		touches = event.touches;
		for( var i in controllers)
			if( !controllers[i].sync)
				controllers[i].fetch();
		event.preventDefault();
	}
	for( var event in {'touchstart':0,'touchmove':0,'touchenter':0,'touchend':0,'touchleave':0,'touchcancel':0})
	{
		document.addEventListener(event, touch_fun, false);
	}
	window.addEventListener('resize', function()
	{
		for( var i=0; i<controllers.length; i++)
			controllers[i].resize();
	}, false);

	function TC(config)
	{
		var $=this;
		$.config=config;
		if( $.config.layout==='gamepad')
		{
			$.state={ up:0,down:0,left:0,right:0,def:0,jump:0,att:0 };
			$.button={
				up:{label:'&uarr;'},down:{label:'&darr;'},left:{label:'&larr;'},right:{label:'&rarr;'},
				def:{label:'D'},jump:{label:'J'},att:{label:'A'}
			};
		}
		else if( $.config.layout==='functionkey')
		{
			$.state={ F1:0,F2:0,F4:0,F7:0};
			$.button={
				F1:{label:'F1'},F2:{label:'F2'},F4:{label:'F4'},F7:{label:'F7'}
			};
		}
		$.child=[];
		$.sync=true;
		$.pause_state=false;
		controllers.push(this);
		for( var key in $.button)
		{
			var el = document.createElement('div');
			util.div('touch_control_holder').appendChild(el);
			el.className = 'touch_controller_button';
			el.innerHTML = '<span>'+$.button[key].label+'</span>';
			$.button[key].el = el;
		}
		$.resize();
	}
	TC.enabled=false;
	TC.enable=function(en)
	{
		TC.enabled = en;
	}
	TC.prototype.type = 'touch';
	TC.prototype.resize=function()
	{
		var $=this;
		var w = window.innerWidth,
			h = window.innerHeight;
		if( $.config.layout==='gamepad')
		{
			var sizeA = 0.20,
				sizeB = 0.20,
				sizeC = 0.25,
				padL = 0.1,
				padR = 0.2,
				offy = 0,
				R = 0.65;
			if( h>w)
			{
				offy = h/2;
				h = w/16*9*1.5;
			}
			sizeA*=h;
			sizeB*=h;
			sizeC*=h;
			this.set_button_pos({
				//'name':[ left, top, width, height ],
				'up':   [ sizeA*padL, h/2-sizeA+offy, sizeA*2, sizeA*R ],
				'down': [ sizeA*padL, h/2+sizeA*(1-R)+offy, sizeA*2, sizeA*R],
				'left': [ sizeA*padL, h/2-sizeA+offy, sizeA*R, sizeA*2],
				'right':[ sizeA*(2-R+padL), h/2-sizeA+offy, sizeA*R, sizeA*2],
				'def':  [ w-sizeB*(1.5+padR), h/2+offy, sizeB, sizeB],
				'jump': [ w-sizeB-sizeC*(1+padR), h/2-sizeB+offy, sizeB, sizeB],
				'att':  [ w-sizeC*(1+padR), h/2-sizeC+offy, sizeC, sizeC]
			});
		}
		else if( $.config.layout==='functionkey')
		{
			$.paused($.pause_state);
		}
	}
	TC.prototype.set_button_pos=function(sett)
	{
		var $=this;
		for( var I in sett)
		{
			var B = $.button[I];
			B.left = sett[I][0];
			B.top = sett[I][1];
			B.right = sett[I][0]+sett[I][2];
			B.bottom = sett[I][1]+sett[I][3];
			B.el.style.left = B.left+'px';
			B.el.style.top = B.top+'px';
			B.el.style.width = (B.right-B.left)+'px';
			B.el.style.height = (B.bottom-B.top)+'px';
		}
	}
	TC.prototype.paused=function(pause)
	{
		var $=this;
		var w = window.innerWidth,
			h = window.innerHeight;
		this.pause_state=pause;
		if( $.config.layout==='functionkey')
		{
			var size = 0.08*(h<w?h:w),
				offy = 0,
				offx = 0;
			if( h>w)
			{
				offy = h/3.5;
				offx = -w/4;
			}
			if( pause)
			{	//expand the collection
				var Fleft = w/3-size/2+offx,
					Ftop = h/4.5-size/2+offy;
				this.set_button_pos({
					'F1':[ Fleft,            Ftop, size, size],
					'F2':[ Fleft+size*1.5,   Ftop, size, size],
					'F4':[ Fleft+size*1.5*3, Ftop, size, size],
					'F7':[ Fleft+size*1.5*6, Ftop, size, size]
				});
				for( var i in {F1:0,F2:0,F4:0,F7:0})
				{
					if( !$.hidden)
						show($.button[i]);
					$.button[i].disabled=30; //disable for 30 frames
				}
			}
			else
			{	//collapse
				this.set_button_pos({
					'F1': [ w/2-size/2, h/4.5-size/2+offy, size, size],
					'F2': [ w/2-size/2, h/4.5-size/2+offy, size, size],
					'F4': [ w/2-size/2, h/4.5-size/2+offy, size, size],
					'F7': [ w/2-size/2, h/4.5-size/2+offy, size, size]
				});
				if( !$.hidden)
					show($.button['F1']);
				$.button['F1'].disabled=false;
				for( var i in {F2:0,F4:0,F7:0})
				{
					hide($.button[i]);
					$.button[i].disabled=true;
				}
			}
		}
	}
	TC.prototype.hide=function()
	{
		var $=this;
		for( var i in $.button)
		{
			hide($.button[i]);
			$.button[i].disabled=true;
		}
		$.hidden=true;
	}
	TC.prototype.show=function()
	{
		var $=this;
		$.hidden=false;
		for( var i in $.button)
		{
			show($.button[i]);
			$.button[i].disabled=false;
		}
	}
	TC.prototype.restart=function()
	{
		var $=this;
		if( $.config.layout==='functionkey')
		{
			this.paused(false);
		}
	}
	TC.prototype.clear_states=function()
	{
		for(var I in this.state)
			this.state[I]=0;
	}
	TC.prototype.fetch=function()
	{
		var $=this;
		for( var key in $.button)
		{
			if( $.button[key].disabled)
			{
				if( typeof $.button[key].disabled==='number')
					$.button[key].disabled--;
				continue;
			}
			var down=false;
			for (var i=0; i<touches.length; i++)
			{
				var T=touches[i];
				if( point_in_rect(T.clientX,T.clientY,$.button[key]))
				{
					down=true;
					break;
				}
			}
			if ((down && !$.state[key]) || (!down && $.state[key]))
			{
				for( var i=0; i<$.child.length; i++)
					$.child[i].key(key,down);
				$.state[key]=down;
			}
		}
	}
	TC.prototype.flush=function()
	{
	}

	return TC;

	//util
	function show(B)
	{
		B.el.style.visibility='visible';
	}
	function hide(B)
	{
		B.el.style.visibility='hidden';
	}
	function inbetween(x,L,R)
	{
		var l,r;
		if ( L<=R)
		{	l=L;
			r=R;
		}
		else
		{	l=R;
			r=L;
		}
		return x>=l && x<=r;
	}
	function point_in_rect(Px,Py,R)
	{
		return (inbetween(Px,R.left,R.right) && inbetween(Py,R.top,R.bottom));
	}
});

;
define("F.core/sprite-dom.js", function(){});

/*\
 * resourcemap
 * 
 * a resourcemap allows mapping from a canonical resource name (shorter and understandable) to the actual url (long and ugly)
\*/
define('F.core/resourcemap',['F.core/util'],function(Futil){

	/*\
	 * resourcemap
	 [ class ]
	 - map (object)
	 * or
	 - map (array) of maps
	 * schema
	 * 
	 * {
	 - condition (function) return true to enable this map. this is only evaluated once in constructor. you can force re-evaluate by calling `update_condition`. if this property is undefined, it is assumed to be __true__.
	 - resource (object) of name-url pairs. this is optional if a `get()` method is specified.
	 - get (function) given the resource name, return the url. this is optional if a `resource` object is specified.
	 * }
	 * 
	 * example
	 | map =
	 | {
	 |	condition: function()
	 |	{
	 |		if( window.location.href.indexOf('http://')===0)
	 |			return true;
	 |	},
	 |	resource:
	 |	{
	 |		'squirrel.png':'http://imagehost.com/FtvJG6rAG2mdB8aHrEa8qXj8GtbYRpqrQs9F8X8.png'
	 |	},
	 |	get: function(res)
	 |	{
	 |		var url='http://imagehost.com/'+res;
	 |		return url;
	 |	}
	 | }
	\*/
	function mapper(map)
	{
		this.map = Futil.make_array(map);
		for( var i=0; i<this.map.length; i++)
			this.map[i] = new submap(this.map[i]);
	}
	/*\
	 * resourcemap.update_condition
	 [ method ]
	 * update the mapping condition. takes effect in subsequent `get` calls.
	 * the mapping function will be disabled if neither `map.resource` nor `map.get` if defined
	\*/
	mapper.prototype.update_condition=function()
	{
		Futil.call_each(this.map,'update_condition');
	}
	/*\
	 * resourcemap.get
	 [ method ]
	 - res (string) resource name
	 = (string) resource url
	 * 
	 * if there are multiple maps, it will go through them one by one in array order,
	 * and returns the result of the first enabled map. if there is no enabled map,
	 * or all maps return null, return `res` as is.
	 * 
	 * for each enabled map, `get()` will first look into `map.resource` for a match,
	 * and fall back to `map.get()` otherwise. if none of them gives truthy result, return null.
	\*/
	mapper.prototype.get=function(res)
	{
		var url;
		for( var i=0; i<this.map.length; i++)
		{
			url = this.map[i].get(res);
			if( url)
				break;
		}
		return url || res;
	}

	/** individual map instances
	 */
	function submap(map)
	{
		this.map = map;
		this.update_condition();
	}
	submap.prototype.update_condition=function()
	{
		if( this.map.condition)
			this.enable = this.map.condition() || false;
		else
			this.enable = true;
		if( typeof this.map.resource !== 'object' &&
			typeof this.map.get      !== 'function')
			this.enable = false;
	}
	submap.prototype.get=function(res)
	{
		if( this.enable)
		{
			if( this.map.resource && this.map.resource[res])
				return this.map.resource[res];
			else
			{
				var url = this.map.get && this.map.get(res);
				if( url) return url;
			}
		}
		return null;
	}
	//
	return mapper;
});

define('LF/manager',['LF/global','LF/network','LF/soundpack','LF/match','LF/util','LF/touchcontroller','LF/third_party/random',
'F.core/util','LF/sprite-select','F.core/sprite-dom.js','F.core/animator','F.core/controller','F.core/resourcemap','F.core/support'],
function(global,network,Soundpack,Match,util,Touchcontroller,Random,
Futil,Fsprite,Fsprite_dom,Fanimator,Fcontroller,Fresourcemap,Fsupport)
{

function Manager(package)
{
	var param = util.location_parameters();
	
	var sel = package.data.UI.data.character_selection;
	var char_list,
		img_list,
		AI_list,
		bg_list,
		diff_list,
		timer,
		randomseed,
		resourcemap;
	var manager = this,
		settings,
		session,
		controllers,
		window_state;
	
	this.create=function()
	{	
		//window sizing
		window_state=
		{
			maximized:false,
			wide:false,
			allow_wide:false
		};
		function onresize()
		{
			if( window.innerWidth<global.application.window.width ||
				window.innerHeight<global.application.window.height )
			{
				if( !window_state.maximized)
				{
					util.div('maximize_button').onclick();
				}
			}
			resizer();
		}
		util.div('maximize_button').onclick=function()
		{
			if( Fsupport.css2dtransform)
			{
				if( !window_state.maximized)
				{
					window_state.maximized=true;
					document.body.style.background = manager.UI_list[manager.active_UI].bgcolor || '#676767';
					this.firstChild.innerHTML='&#9724;';
					util.div().classList.add('maximized');
					resizer();
				}
				else
				{
					this.firstChild.innerHTML='&#9723;';
					util.div().classList.remove('maximized');
					document.body.style.background='';
					resizer(1);
					window_state.maximized=false;
					if( window_state.wide)
					{
						window_state.wide=false;
						util.div().classList.remove('wideWindow');
						if( util.div('canvas').width)
						{
							var owidth = global.application.window.width;
							util.div('canvas').width = owidth;
							util.div('canvas').style.left = 0;
							manager.canvas.set_x_y(0,0);
							manager.canvas.set_w(owidth);
						}
						manager.background_layer.set_x_y(0,0);
						manager.panel_layer.set_alpha(1.0);
						manager.canvas.render();
					}
				}
			}
		}
		
		session=
		{
			network:false,
			control:null,
			player:[]
		};
		var support_touch=false;
		if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
			support_touch=true;
		}
		
		var settings_format_version=1.00001;
		settings=
		{
			version:settings_format_version,
			control:
			[
				{
					type:'keyboard',
					config: { up:'w',down:'x',left:'a',right:'d',def:'z',jump:'q',att:'s' }
				},
				{
					type:'keyboard',
					config: { up:'u',down:'m',left:'h',right:'k',def:',',jump:'i',att:'j' }
				}
			],
			player:
			[
				{name:'player1'},{name:'player2'}
			],
			server:
			{
				'F.LF official server':'http://flf-lodge.herokuapp.com'
			},
			support_sound:false,
			enable_sound:true
		};
		if( support_touch)
			settings.control[0].type='touch';
		if( Fsupport.localStorage)
		{
			window.addEventListener('beforeunload',function(){
				Fsupport.localStorage.setItem('F.LF/settings',JSON.stringify(settings));
			},false);
			if( Fsupport.localStorage.getItem('F.LF/settings'))
			{
				var obj = JSON.parse(Fsupport.localStorage.getItem('F.LF/settings'));
				if( obj.version===settings_format_version)
					settings = obj;
			}
		}
		for( var i=0; i<settings.player.length; i++)
		{
			session.player[i] = settings.player[i];
		}
		
		//control
		var functionkey_config = { 'esc':'esc','F1':'F1','F2':'F2','F3':'F3','F4':'F4','F5':'F5','F6':'F6','F7':'F7','F8':'F8','F9':'F9','F10':'F10' };
		controllers=
		{
			keyboard:{
				c0: new Fcontroller(settings.control[0].config),
				c1: new Fcontroller(settings.control[1].config),
				f: new Fcontroller(functionkey_config)
			},
			touch:support_touch?{
				c: new Touchcontroller({layout:'gamepad'}),
				f: new Touchcontroller({layout:'functionkey'})
			}:null
		};
		Touchcontroller.enable(false);
		if( controllers.touch)
		{
			controllers.touch.c.hide();
			controllers.touch.f.hide();
		}
		session.control=
		{
			'0': controllers.keyboard.c0,
			'1': controllers.keyboard.c1,
			f: controllers.keyboard.f,
			length: 2,
			my_offset: 0
		};
		if( settings.control[0].type==='touch')
		{
			session.control[0] = controllers.touch.c;
			session.control.f = controllers.touch.f;
		}
		else if( settings.control[1].type==='touch')
		{
			session.control[1] = controllers.touch.c;
			session.control.f = controllers.touch.f;
		}
		
		//setup resource map
		util.organize_package(package);
		resourcemap = new Fresourcemap(util.setup_resourcemap(package));
		Fsprite.masterconfig_set('resourcemap',resourcemap);
		Fsprite_dom.masterconfig_set('resourcemap',resourcemap);
		
		//sound
		if( settings.support_sound && settings.enable_sound)
			manager.sound = new Soundpack({
				packs: package.data.sound,
				resourcemap: resourcemap
			});
		else
			manager.sound = new Soundpack(null);
		if( !settings.support_sound)
		{
			hide(util.div('enable_sound'));
			Soundpack.support(function(features)
			{
				settings.support_sound = true;
				show(util.div('enable_sound'));
			});
		}
		util.div('enable_sound_checkbox').checked = settings.enable_sound;
		util.div('enable_sound_checkbox').onchange=function()
		{
			settings.enable_sound = this.checked;
		}
		
		//rand
		randomseed = new Random();
		randomseed.seed(457624123);
		
		//prepare
		char_list = util.select_from(package.data.object,{type:'character'});
		char_list[-1] = {name:'Random'}
		img_list = Futil.extract_array(char_list,'pic').pic;
		img_list.waiting = sel.waiting.pic;
		img_list[-1] = package.data.UI.data.character_selection.random.pic;
		AI_list = package.data.AI.slice(0);
		AI_list[-1] = {name:'Random'};
		bg_list = package.data.background.slice(0);
		bg_list[-1] = {name:'Random'};
		diff_list = ['Easy','Normal','Difficult'];
		
		this.create_UI();
		if( param.demo)
			this.start_demo();
		else if( param.debug)
			this.start_debug();
		else
			this.switch_UI('frontpage');
		//
		window.addEventListener('resize', onresize, false);
		onresize();
	}
	function create_network_controllers(config)
	{
		var monitor = {};
		monitor.log = monitor.error = function()
		{
			util.div('network_log').value += Array.prototype.slice.call(arguments).join(' ')+'\n';
		}
		function success()
		{
			util.div('network_game_cancel').innerHTML='OK';
		}
		network.setup({
			transport:{
				layer:config.transport,
				host:config.host
			},
			role:config.role,
			id1:config.id1,
			id2:config.id2,
			monitor:monitor,
			success:success
		});
		var controller_config = { up:'w',down:'x',left:'a',right:'d',def:'z',jump:'q',att:'s' };
		if( config.role)
		{
			if( config.role==='active')
			{
				session.control[0] = new network.controller('local',session.control[0]);
				session.control[1] = new network.controller('local',session.control[1]);
				session.control[2] = new network.controller('remote',controller_config);
				session.control[3] = new network.controller('remote',controller_config);
				session.control.length = 4;
				session.control.f  = new network.controller('dual',session.control.f);
				network.messenger.send(settings.player);
				network.messenger.receiver = [{
					onmessage:function(player)
					{
						session.player[0] = settings.player[0];
						session.player[1] = settings.player[1];
						session.player[2] = player[0];
						session.player[3] = player[1];
						manager.UI_list.settings.keychanger.call(manager.UI_list.settings);
					}
				}];
			}
			else if( config.role==='passive')
			{
				var hold0 = session.control[0],
					hold1 = session.control[1];
				session.control[2] = new network.controller('local',hold0);
				session.control[3] = new network.controller('local',hold1);
				session.control[0] = new network.controller('remote',controller_config);
				session.control[1] = new network.controller('remote',controller_config);
				session.control.my_offset = 2;
				session.control.length = 4;
				session.control.f  = new network.controller('dual',session.control.f);
				network.messenger.send(settings.player);
				network.messenger.receiver = [{
					onmessage:function(player)
					{
						session.player[0] = player[0];
						session.player[1] = player[1];
						session.player[2] = settings.player[0];
						session.player[3] = settings.player[1];
						manager.UI_list.settings.keychanger.call(manager.UI_list.settings);
					}
				}];
			}
		}
	}
	this.UI_list=
	{
		'frontpage':
		{
			bgcolor:package.data.UI.data.frontpage.bg_color,
			create:function()
			{
				new Fsprite_dom({
					canvas: util.div('frontpage_content'),
					img: package.data.UI.data.frontpage.pic,
					wh: 'fit'
				});
				this.dialog = new vertical_menu_dialog({
					canvas: util.div('frontpage_content'),
					data: package.data.UI.data.frontpage_dialog,
					mousehover: true,
					onclick: function(I)
					{
						if( I===0)
						{
							manager.start_game();
							manager.match_end();
							manager.switch_UI('character_selection');
						}
						else if( I===1)
						{
							manager.switch_UI('network_game');
						}
						else if( I===2)
						{
							manager.switch_UI('settings');
						}
					}
				});
			},
			onactive:function()
			{
				this.demax(!window_state.maximized);
			},
			deactive:function()
			{
				this.demax(true);
			},
			demax:function(demax)
			{
				if( !demax) //maximize
				{
					var holder = util.div('frontpage');
					holder.parentNode.removeChild(holder);
					holder.classList.add('maximized');
					util.root.insertBefore(holder,util.root.firstChild);
					hide(util.div('window'));
				}
				else //demaximize
				{
					var holder = util.div('frontpage');
					holder.parentNode.removeChild(holder);
					holder.classList.remove('maximized');
					util.div('window').insertBefore(holder,util.div('window').firstChild);
					show(util.div('window'));
				}
			}
		},
		'settings':
		{
			bgcolor:package.data.UI.data.settings.bg_color,
			create:function()
			{
				new Fsprite_dom({
					canvas: util.div('settings'),
					img: package.data.UI.data.settings.pic,
					wh: 'fit'
				});
				new vertical_menu_dialog({
					canvas: util.div('settings'),
					data: package.data.UI.data.settings.ok_button,
					mousehover: true,
					onclick: function(I)
					{
						manager.switch_UI('frontpage');
					}
				});
				this.keychanger.call(this);
			},
			keychanger:function()
			{
				var keychanger = util.div('keychanger');
				if( keychanger)
					keychanger.parentNode.removeChild(keychanger);
				var keychanger = document.createElement('div');
					keychanger.className = 'keychanger';
				util.div('settings').appendChild(keychanger);
				var brbr=create_at(keychanger, 'br'),
					table=create_at(keychanger, 'table'),
					row=[],
					change_active=false;
				var column = this.column = [];
				
				table.style.display='inline-block';
				for( var i=0; i<9; i++)
					row[i]=create_at(table, 'tr');
				var i=0;
				left_cell(row[i++],'name');
				left_cell(row[i++],'type');
				for( var I in settings.control[0].config)
					left_cell(row[i++],I);
				for( var i=0; i<session.control.length; i++)
					column[i] = new Control(i);
				
				function Control(num)
				{
					var This=this;
					var name = right_cell(row[0],'');
					var type = right_cell(row[1],'');
					var cells = {};
					var i=2;
					for( var I in settings.control[0].config)
						cells[I] = add_changer(row[i++],I);
					this.update = update;
					update();
					if( session.control[num].role===undefined)
					{
						name.onclick=function()
						{
							name.innerHTML = settings.player[num-session.control.my_offset].name = (prompt('Enter player name:',name.innerHTML) || name.innerHTML);
						}
						type.onclick=function()
						{
							if( controllers.touch)
							{
								if( session.control[num].type==='keyboard')
								{
									if( session.control[session.control.my_offset+(num-session.control.my_offset===0?1:0)].type!=='touch')
									{	//switch to touch
										settings.control[num].type = 'touch';
										session.control[num] = controllers.touch.c;
										session.control.f = controllers.touch.f;
									}
								}
								else
								{	//switch to keyboard
									settings.control[num].type = 'keyboard';
									session.control[num] = controllers.keyboard['c'+num];
									session.control.f = controllers.keyboard.f;
								}
								update();
							}
						}
					}
					function add_changer(R,name)
					{
						var cell=right_cell(R,'');
						var target;
						cell.onclick=function()
						{
							if( session.control[num].type==='keyboard')
							if( !change_active)
							{
								change_active=true;
								target=this;
								target.style.color='#000';
								target.style.backgroundColor='#FFF';
								document.addEventListener('keydown', keydown, true);
							}
						}
						function keydown(e)
						{
							var con = session.control[num];
							if (!e) e = window.event;
							var value=e.keyCode;
							cell.innerHTML=Fcontroller.keycode_to_keyname(value);
							con.config[name]=Fcontroller.keycode_to_keyname(value);
							con.keycode[name]=value;
							target.style.color='';
							target.style.backgroundColor='';
							change_active=false;
							document.removeEventListener('keydown', keydown, true);
						}
						return cell;
					}
					function update()
					{
						var con = session.control[num];
						name.innerHTML = session.player[num].name;
						type.innerHTML = con.role==='remote'?'network':con.type;
						for( var I in cells)
							if( con.type==='keyboard')
								cells[I].innerHTML = con.config[I];
							else
								cells[I].innerHTML = '-';
					}
				}
				
				function create_at(parent, tag, id)
				{
					var E = document.createElement(tag);
					parent.appendChild(E);
					if( id)
						E.id = id;
					return E;
				}
				
				function add_cell(row, content, bg_color, text_color)
				{
					var td = create_at(row, 'td')
					td.innerHTML= content;
					if( bg_color)
						td.style.backgroundColor = bg_color;
					if( text_color)
						td.style.color = text_color;
					return td;
				}
				function left_cell(A,B)
				{
					var bg_color = package.data.UI.data.settings.leftmost_column_bg_color,
						text_color = package.data.UI.data.settings.leftmost_column_text_color;
					var cell = add_cell(A,B,bg_color,text_color);
					cell.style.textAlign='right';
					cell.style.width='80px';
					cell.style.padding='0 20px';
					return cell;
				}
				function right_cell(A,B)
				{
					var cell = add_cell(A,B);
						cell.style.cursor='pointer';
					return cell;
				}
			},
			onactive:function()
			{
				for( var i=0; i<this.column.length; i++)
				{
					this.column[i].update();
				}
			}
		},
		'network_game':
		{
			bgcolor:package.data.UI.data.network_game.bg_color,
			create:function()
			{
				var This = this;
				This.last_value = 'http://myserver.com:8080';
				for( var S in settings.server)
				{
					var op = document.createElement('option');
					op.innerHTML = op.value = S;
					util.div('server_select').appendChild(op);
				}
				var op = document.createElement('option');
				var last_option;
				op.value = 'third_party_server';
				op.innerHTML = 'third party server';
				util.div('server_select').appendChild(op);
				util.div('server_select').onchange=function()
				{
					if( this.value==='third_party_server')
					{
						util.div('server_address').value=This.last_value;
						util.div('server_address').readOnly=false;
					}
					else
					{
						if( last_option==='third_party_server')
							This.last_value = util.div('server_address').value;
						util.div('server_address').value=settings.server[this.value];
						util.div('server_address').readOnly=true;
					}
					last_option = this.value;
				}
				util.div('server_select').onchange();
				util.div('network_game_cancel').innerHTML='Cancel';
				util.div('network_game_cancel').onclick=function()
				{
					manager.switch_UI('frontpage');
				}
				if( param.server)
				{
					var address = param.server.replace(/\|/g,'/');
					util.div('server_select').value = 'third_party_server';
					util.div('server_address').value = address;
				}
				util.div('server_connect').onclick=function()
				{
					var server_address = normalize_address(util.div('server_address').value);
					requirejs(['//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js'],
					function()
					{
						if( !This.connecting)
						{
							jQuery.ajax({
								url: server_address+'/protocol',
								type: 'GET',
								dataType: 'text',
								timeout: 2000,
								success:function(data)
								{
									This.connecting=false;
									var server = JSON.parse(data);
										server.address = server_address;
									if( server.name!=='F.LF official server')
										settings.server[server.name] = server_address;
									manager.UI_list.lobby.start(server);
									manager.switch_UI('lobby');
								},
								error:function(A,B,C)
								{
									alert('Failed to connect to server.\n'+B+': '+C);
									This.connecting=false;
								}
							});
							This.connecting=true;
						}
					});
				}
				function normalize_address(str)
				{
					if( str.charAt(str.length-1)==='/')
						return str.slice(0,str.length-1);
					return str;
				}
			},
			onactive:function()
			{
				Fcontroller.block(false);
			},
			deactive:function()
			{
				Fcontroller.block(true);
			}
		},
		'lobby':
		{
			start:function(server)
			{
				util.div('lobby').src = server.address;
				util.div('lobby').onload = function()
				{
					util.div('lobby').contentWindow.postMessage('Hello from F.LF',server.address);
				}
				//cross window communication
				window.addEventListener('message', windowMessage, false);
				function windowMessage(event)
				{
					if( event.origin!==server.address)
						return;
					switch(event.data.event)
					{
						case 'start_game':
							create_network_controllers({
								transport:event.data.transport,
								host:server.address,
								role:event.data.role,
								id1:event.data.id1,
								id2:event.data.id2
							});
							util.div('server_connect').onclick=null;
							util.div('server_connect').innerHTML='|';
						//no break here
						case 'disconnect':
							util.div('lobby').onload = null;
							util.div('lobby').src = '';
							manager.switch_UI('network_game');
						break;
					}
				}
			}
		},
		'character_selection':
		{
			bgcolor:package.data.UI.data.character_selection.bg_color,
			create:function()
			{
				this.state=
				{
					t:0,
					step:0,
					setting_computer:-1
				};
				
				var bg = new Fsprite_dom({
					canvas: util.div('character_selection'),
					img: package.data.UI.data.character_selection.pic,
					wh: 'fit'
				});
				
				var players = this.players = [];
				for( var i=0; i<8; i++)
				{
					//sprite & animator
					var sp = new Fsprite_dom({
						canvas: util.div('character_selection'),
						img: img_list,
						xywh: {
							x:sel.posx[i%4], y:sel.posy[i-i%4],
							w:sel.box_width, h:sel.box_height
						}
					});
					var ani_config=
					{
						x:0, y:0,          //top left margin of the frames
						w:sel.box_width, h:sel.box_height, //width, height of a frame
						gx:10,gy:1,        //define a gx*gy grid of frames
						tar:sp             //target F_sprite
					}
					var ani = new Fanimator(ani_config);
					//text boxes
					var textbox = [];
					for( var j=0; j<3; j++)
					{
						textbox.push(create_textbox({
							canvas: util.div('character_selection'),
							xywh: {
								x:sel.posx[i%4],      y:sel.posy[i-i%4+j+1],
								w:sel.text.box_width, h:sel.text.box_height
							}
						}));
					}
					//
					this.players.push({
						sp:sp,
						ani:ani,
						textbox:textbox
					});
				}
				
				this.dialog = new vertical_menu_dialog({
					canvas: util.div('character_selection'),
					data: package.data.UI.data.vs_mode_dialog
				});
				this.how_many = new horizontal_number_dialog({
					canvas: util.div('character_selection'),
					data: package.data.UI.data.how_many_computer_players
				});
				var TBX = ['background_textbox', 'difficulty_textbox'];
				for( var i in TBX)
				{
					var textarea = package.data.UI.data.vs_mode_dialog.text[i];
					this.dialog[TBX[i]] = create_textbox({
						canvas: this.dialog.dia,
						xywh: {
							x:textarea[0], y:textarea[1],
							w:textarea[2], h:textarea[3]
						},
						color: package.data.UI.data.vs_mode_dialog.text_color
					});
				}
				this.options = {};
				
				this.steps = [
				{	//step 0
					//human players select characters
					key: function(i,key)
					{
						switch(key)
						{
							case 'att':
								players[i].use=true;
								players[i].type='human';
								players[i].name=session.player[i]?session.player[i].name:'';
								players[i].step++;
								var finished=true;
								for( var k=0; k<players.length; k++)
									finished = finished && (players[k].use? players[k].step===3:true);
								if( finished)
								{
									this.set_step(1);
								}
								manager.sound.play('1/m_join');
							break;
							case 'jump':
								if( players[i].step>0)
								{
									players[i].step--;
									if( players[i].step===0)
										players[i].use = false;
								}
								manager.sound.play('1/m_cancel');
							break;
							case 'right':
								if( players[i].step===1)
								{
									players[i].selected++;
									if( players[i].selected>=char_list.length)
										players[i].selected = -1;
								}
								if( players[i].step===2)
								{
									players[i].team++;
									if( players[i].team>4)
										players[i].team = 0;
								}
							break;
							case 'left':
								if( players[i].step===1)
								{
									players[i].selected--;
									if( players[i].selected<-1)
										players[i].selected = char_list.length-1;
								}
								if( players[i].step===2)
								{
									players[i].team--;
									if( players[i].team<0)
										players[i].team = 4;
								}
							break;
						}
					},
					show: function()
					{
						for( var i=0; i<players.length; i++)
						{
							switch (players[i].step)
							{
								case 0:
									players[i].textbox[0].innerHTML = 'Join?';
									players[i].textbox[1].innerHTML = '';
									players[i].textbox[2].innerHTML = '';
									players[i].sp.switch_img('waiting');
								break;
								case 1:
									players[i].textbox[0].style.color = static_color(i);
									players[i].textbox[0].innerHTML = players[i].name;
									players[i].textbox[1].innerHTML = char_list[players[i].selected].name;
									players[i].textbox[2].innerHTML = '';
									players[i].ani.rewind();
									players[i].sp.switch_img(players[i].selected);
								break;
								case 2:
									players[i].textbox[1].style.color = static_color(i);
									players[i].textbox[2].innerHTML = players[i].team===0?'Independent':'Team '+players[i].team;
								break;
								case 3:
									players[i].textbox[2].style.color = static_color(i);
								break;
							}
						}
					},
					enter: function()
					{
						for( var i=0; i<players.length; i++)
						{
							players[i].sp.show();
							for( var j=0; j<players[i].textbox.length; j++)
								show(players[i].textbox[j]);
						}
					},
					leave: function()
					{
						for( var i=0; i<players.length; i++)
						{
							if( !players[i].use)
							{
								players[i].sp.hide();
								for( var j=0; j<players[i].textbox.length; j++)
									hide(players[i].textbox[j]);
							}
							else
							{
								players[i].textbox[players[i].textbox.length-1].style.color = static_color(i);
							}
						}
					}
				},
				{
					//step 1
					//how many computers
					key: function(i,key)
					{
						switch(key)
						{
							case 'att':
								this.state.num_of_computers = parseInt(this.how_many.active_item);
								this.set_step(2);
							break;
							case 'left':
								this.how_many.nav_left();
							break;
							case 'right':
								this.how_many.nav_right();
							break;
						}
					},
					show: function()
					{
					},
					enter: function()
					{
						var low=0, high;
						var used = 0;
						for( var i=0; i<players.length; i++)
							if( players[i].use)
								used++;
						high = players.length-used;
						var same_team = true;
						var last_item;
						for( var i=0; i<players.length; i++)
							if( players[i].use)
							{
								if( last_item===undefined)
									last_item = i;
								else
									same_team = same_team && players[i].team===players[last_item].team && players[i].team!==0;
							}
						if( same_team)
							low = 1;
						this.how_many.init(low,high);
						this.how_many.show();
					},
					leave: function()
					{
						this.how_many.hide();
					}
				},
				{	//step 2
					//select computers
					key: function step1_key(i,key)
					{
						switch(key)
						{
							case 'att':
								i = this.state.setting_computer;
								players[i].step++;
								if( players[i].step===3)
								{
									this.state.already_set_computer++;
									this.steps[this.state.step].next_computer_slot.call(this);
								}
								manager.sound.play('1/m_join');
							break;
							case 'jump':
								i = this.state.setting_computer;
								if( players[i].step>0)
									players[i].step--;
								manager.sound.play('1/m_cancel');
							break;
							case 'right':
								i = this.state.setting_computer;
								if( players[i].step===1)
								{
									players[i].selected++;
									if( players[i].selected>=char_list.length)
										players[i].selected = 0;
								}
								if( players[i].step===2)
								{
									players[i].team++;
									if( players[i].team>4)
										players[i].team = 0;
								}
								if( players[i].step===0 && players[i].type==='computer')
								{
									players[i].selected_AI++;
									if( players[i].selected_AI>=AI_list.length)
										players[i].selected_AI = -1;
								}
							break;
							case 'left':
								i = this.state.setting_computer;
								if( players[i].step===1)
								{
									players[i].selected--;
									if( players[i].selected<0)
										players[i].selected = char_list.length-1;
								}
								if( players[i].step===2)
								{
									players[i].team--;
									if( players[i].team<0)
										players[i].team = 4;
								}
								if( players[i].step===0 && players[i].type==='computer')
								{
									players[i].selected_AI--;
									if( players[i].selected_AI<-1)
										players[i].selected_AI = AI_list.length-1;
								}
							break;
						}
					},
					show: function()
					{
						for( var i=0; i<players.length; i++)
						{
							switch (players[i].step)
							{
								case 0:
									players[i].name = AI_list[players[i].selected_AI].name;
									players[i].textbox[0].innerHTML = players[i].name;
									players[i].textbox[1].innerHTML = char_list[players[i].selected].name;
									players[i].textbox[2].innerHTML = '';
									players[i].ani.rewind();
									players[i].sp.switch_img(players[i].selected);
								break;
								case 1:
									players[i].textbox[0].style.color = static_color(i);
									players[i].textbox[1].innerHTML = char_list[players[i].selected].name;
									players[i].textbox[2].innerHTML = '';
									players[i].sp.switch_img(players[i].selected);
								break;
								case 2:
									players[i].textbox[1].style.color = static_color(i);
									players[i].textbox[2].innerHTML = players[i].team===0?'Independent':'Team '+players[i].team;
								break;
								case 3:
									players[i].textbox[2].style.color = static_color(i);
								break;
							}
						}
					},
					enter: function()
					{
						this.state.already_set_computer = 0;
						this.steps[this.state.step].next_computer_slot.call(this);
					},
					next_computer_slot: function()
					{
						if( this.state.num_of_computers===this.state.already_set_computer)
						{
							this.set_step(3);
							return;
						}
						var next;
						for( var i=0; i<players.length; i++)
						{
							if( !players[i].use)
							{
								next = i;
								break;
							}
						}
						if( next!==undefined)
						{
							var i = this.state.setting_computer = next;
							players[i].use = true;
							players[i].step = 0;
							players[i].type = 'computer';
							players[i].sp.show();
							for( var j=0; j<players[i].textbox.length; j++)
								show(players[i].textbox[j]);
						}
					}
				},
				{	//step 3
					//dialog menu
					key: function step2_key(i,key)
					{
						switch(key)
						{
							case 'att':
								manager.sound.play('1/m_ok');
								switch (this.dialog.active_item)
								{
									case 0: manager.start_match({
										players:this.players,
										options:this.options
									}); return; //Fight!
									case 1:
										this.reset();
										this.set_step(0);
									return; //Reset All
									case 2: //Reset Random
										this.steps[this.state.step].update_random.call(this);
									return;
									case 3: break; //Background
									case 4: break; //Difficulty
									case 5: break; //Exit
								}
								if( this.dialog.active_item===3)
									step2_key.call(this,i,'right');
							break;
							case 'jump':
								//cannot go back
							break;
							case 'right':
								if( this.dialog.active_item===3)
								{
									this.options.background++;
									if( this.options.background>=bg_list.length)
										this.options.background = -1;
								}
							break;
							case 'left':
								if( this.dialog.active_item===3)
								{
									this.options.background--;
									if( this.options.background<-1)
										this.options.background = bg_list.length-1;
								}
							break;
							case 'up':
								this.dialog.nav_up();
							break;
							case 'down':
								this.dialog.nav_down();
							break;
						}
					},
					show: function()
					{
						this.dialog.show();
						for( var i=0; i<players.length; i++)
						{
							switch (players[i].step)
							{
								case 3:
									players[i].textbox[2].style.color = static_color(i);
								break;
							}
						}
						this.dialog.background_textbox.innerHTML = bg_list[this.options.background].name;
						this.dialog.difficulty_textbox.innerHTML = diff_list[this.options.difficulty];
					},
					enter: function()
					{
						this.state.random_slot = {};
						this.state.random_AI = {};
						for( var i=0; i<players.length; i++)
						{
							if( players[i].selected===-1)
								this.state.random_slot[i] = true;
							if( players[i].selected_AI===-1)
								this.state.random_AI[i] = true;
						}
						this.steps[this.state.step].update_random.call(this);
					},
					update_random: function()
					{
						for( var i in this.state.random_slot)
						{
							players[i].selected = Math.floor(randomseed.next()*char_list.length);
							players[i].textbox[1].innerHTML = char_list[players[i].selected].name;
							players[i].sp.switch_img(players[i].selected);
						}
						for( var i in this.state.random_AI)
						{
							if( players[i].type==='computer')
							{
								players[i].selected_AI = Math.floor(randomseed.next()*AI_list.length);
								players[i].textbox[0].innerHTML = AI_list[players[i].selected_AI].name;
							}
						}
					}
				}
				];
				
				this.reset();
				
				function static_color(i)
				{
					return players[i].type==='human'?sel.text.color[2]:sel.text.color[3];
				}
			},
			reset:function()
			{
				var players = this.players;
				this.state.step = 0;
				this.dialog.hide();
				this.dialog.activate_item(0);
				this.how_many.hide();
				for( var i=0; i<players.length; i++)
				{
					players[i].use = false;
					players[i].step = 0;
					players[i].type = 'human';
					players[i].name = '';
					players[i].team = 0;
					players[i].selected = -1;
					players[i].selected_AI = -1;
				}
				this.options.background = -1;
				this.options.difficulty = 2;
				this.steps[this.state.step].show.call(this);
			},
			key:function(controller_num,key)
			{
				var players = this.players;
				var i = controller_num;
				if( this.state.step>0 && players[i].type!=='human')
					return;
				this.steps[this.state.step].key.call(this,i,key);
				this.steps[this.state.step].show.call(this);
			},
			set_step:function(newstep)
			{
				if( this.steps[this.state.step].leave)
					this.steps[this.state.step].leave.call(this);
				this.state.step = newstep;
				if( this.steps[this.state.step].enter)
					this.steps[this.state.step].enter.call(this);
			},
			frame:function()
			{
				var players = this.players;
				var t = this.state.t;
				for( var i in players)
				{
					switch (players[i].step)
					{
						case 0:
							if( this.state.step===0)
								players[i].ani.set_frame(t%2);
							players[i].textbox[0].style.color = sel.text.color[t%2];
						break;
						case 1:
							players[i].textbox[1].style.color = sel.text.color[t%2];
						break;
						case 2:
							players[i].textbox[2].style.color = sel.text.color[t%2];
						break;
					}
				}
				for( var i=0; i<session.control.length; i++)
					session.control[i].fetch();
				manager.sound.TU();
				this.state.t++;
			}
		},
		'gameplay':
		{
			allow_wide:true,
			create:function()
			{
				if( util.div('pause_message'))
				{
					var dat = package.data.UI.data.message_overlay;
					manager.overlay_mess = new Fsprite_dom({
						div: util.div('pause_message'),
						img: dat.pic
					});
					manager.overlay_mess.hide();
				}
				manager.gameplay = util.div('gameplay');
				manager.canvas = get_canvas();
				manager.background_layer = new Fsprite({
					canvas:manager.canvas,
					type:'group'
				});
				manager.panel_layer = new Fsprite({
					canvas:manager.canvas,
					type:'group',
					wh:{w:package.data.UI.data.panel.width,h:package.data.UI.data.panel.height}
				});
				manager.summary = new summary_dialog({
					div:util.div('summary_dialog'),
					data:package.data.UI.data.summary
				});

				if( Fsprite.renderer==='DOM')
				{
					manager.panel_layer.el.className = 'panel';
					manager.background_layer.el.className = 'background';
				}
				var panels=[];
				for( var i=0; i<8; i++)
				{
					var pane = new Fsprite({
						canvas: manager.panel_layer,
						img: package.data.UI.data.panel.pic,
						wh: 'fit'
					});
					pane.set_x_y(package.data.UI.data.panel.pane_width*(i%4), package.data.UI.data.panel.pane_height*Math.floor(i/4));
					panels.push(pane);
				}
				function get_canvas()
				{
					if( Fsprite.renderer==='DOM')
					{
						return new Fsprite({
							div:util.div('gameplay'),
							type:'group',
							bgcolor:'#676767'
						});
					}
					else if( Fsprite.renderer==='canvas')
					{
						var canvas_node = util.div('gameplay').getElementsByClassName('canvas')[0];
						canvas_node.width = global.application.window.width;
						canvas_node.height = global.application.window.height;
						return new Fsprite({
							canvas:canvas_node,
							type:'group',
							bgcolor:'#676767',
							wh:{w:global.application.window.width,h:global.application.window.height}
						})
					}
				}
			}
		}
	};
	function resizer(ratio)
	{
		var demax = ratio===1;
		if( window_state.maximized)
		{
			var last_window_state_wide = window_state.wide;
			var want_wide = window.innerWidth/window.innerHeight > 15/9;
			if( want_wide)
			{
				if( window_state.allow_wide && !window_state.wide)
				{
					window_state.wide=true;
					util.div().classList.add('wideWindow');
					//double arrow symbol '&#8622;&#8596;'
				}
			}
			if( window_state.wide &&
				(!window_state.allow_wide || !want_wide))
			{
				window_state.wide=false;
				util.div().classList.remove('wideWindow');
			}
			
			var fratio = ratio;
			if( typeof ratio!=='number')
			{
				var width = parseInt(window.getComputedStyle(util.container,null).getPropertyValue('width')),
					height = parseInt(window.getComputedStyle(util.container,null).getPropertyValue('height'));
				this.width = width;
				if( height>100) this.height = height;
				var ratioh = window.innerHeight/this.height,
					ratiow = window.innerWidth/this.width;
				ratio = ratioh<ratiow? ratioh:ratiow;
				fratio = ratio;
				ratio = Math.floor(ratio*100)/100;
			}
			if( manager.active_UI==='frontpage')
			{
				manager.UI_list['frontpage'].demax(demax);
			}
			if( !ratio) return;
			var canx = window.innerWidth/2-parseInt(window.getComputedStyle(util.container,null).getPropertyValue('width'))/2*ratio;
			if( demax) canx=0;
			if( Fsupport.css3dtransform)
			{
				util.container.style[Fsupport.css3dtransform+'Origin']= '0 0';
				util.container.style[Fsupport.css3dtransform]=
					'translate3d('+canx+'px,0,0) '+
					'scale3d('+ratio+','+ratio+',1.0) ';
			}
			else if( Fsupport.css2dtransform)
			{
				util.container.style[Fsupport.css2dtransform+'Origin']= '0 0';
				util.container.style[Fsupport.css2dtransform]=
					'translate('+canx+'px,0) '+
					'scale('+ratio+','+ratio+') ';
			}
			if( last_window_state_wide !== window_state.wide)
			{	//wide state changed
				if( window_state.wide)
				{
					manager.background_layer.set_x_y(0,-package.data.UI.data.panel.height);
					manager.panel_layer.set_alpha(0.5);
				}
				else
				{
					manager.background_layer.set_x_y(0,0);
					manager.panel_layer.set_alpha(1.0);
				}
				if( util.div('canvas').width)
				{	//using canvas rendering backend
					var owidth = global.application.window.width;
					var wide_width = global.application.window.wide_width;
					if( window_state.wide)
					{	//widen the canvas
						util.div('canvas').width = wide_width;
						var offx = Math.floor((wide_width-owidth)/2);
						util.div('canvas').style.left = -offx+'px';
						manager.canvas.set_x_y(offx,0);
						manager.canvas.set_w(wide_width);
					}
					else
					{	//restore the canvas
						util.div('canvas').width = owidth;
						util.div('canvas').style.left = 0;
						manager.canvas.set_x_y(0,0);
						manager.canvas.set_w(owidth);
					}
					manager.canvas.render();
				}
			}
		}
	}
	this.frame=function()
	{
		this.dispatch_event('frame');
	}
	this.key=function()
	{
		this.dispatch_event('key',arguments);
	}
	this.dispatch_event=function(event,args)
	{
		var active = this.UI_list[this.active_UI];
		if( active && active[event])
			active[event].apply(active,args);
	}
	this.create_UI=function()
	{
		for( var I in this.UI_list)
		{
			if( this.UI_list[I].create)
				this.UI_list[I].create.call(this.UI_list[I]);
		}
	}
	this.switch_UI=function(page)
	{
		this.dispatch_event('deactive');
		this.active_UI = page;
		for( var P in this.UI_list)
		{
			util.div(P).style.display = page===P? '':'none';
		}
		if( window_state.allow_wide !== this.UI_list[page].allow_wide)
		{
			window_state.allow_wide = this.UI_list[page].allow_wide;
			if( window_state.maximized && window_state.wide!==window_state.allow_wide)
				resizer();
		}
		util.div('window').style.background = this.UI_list[page].bgcolor || '';
		if( window_state.maximized)
		{
			document.body.style.background = this.UI_list[page].bgcolor || '#676767';
		}
		this.dispatch_event('onactive');
	}
	this.match_end=function(event)
	{
		this.switch_UI('character_selection');

		//create timer
		var This=this;
		if( timer) network.clearInterval(timer);
		timer = network.setInterval(function(){This.frame();},1000/12);
		//create controller listener
		for( var i=0; i<session.control.length; i++)
			(function(i){
				session.control[i].child=[{
					key:function(K,D){if(D)This.key(i,K);}
				}];
			}(i));
		session.control.f.child=[];
		if( session.control.f.hide)
			session.control.f.hide();
	}
	this.start_game=function()
	{
		if( typeof jQuery !== 'undefined')
			jQuery.noConflict();
		for( var i=0; i<session.control.length; i++)
			session.control[i].sync=true;
		session.control.f.sync=true;
		for( var i=0; i<session.control.length; i++)
		{
			if( session.control[i].type==='touch')
			{
				session.control[i].show();
				Touchcontroller.enable(true);
			}
		}
		
		//sound
		if( settings.support_sound && settings.enable_sound && manager.sound.dummy)
			manager.sound = new Soundpack({
				packs: package.data.sound,
				resourcemap: resourcemap
			});
		else if( !settings.enable_sound && !manager.sound.dummy)
			manager.sound = new Soundpack(null);
		manager.sound.play('1/m_ok');
	}
	this.start_match=function(config)
	{
		this.switch_UI('gameplay');

		if( timer) network.clearInterval(timer);

		for( var i=0; i<session.control.length; i++)
			session.control[i].child=[];
		if( !config.demo_mode)
		{
			session.control.f.child=[];
			if( session.control.f.show)
				session.control.f.show();
		}

		var match = new Match
		({
			manager: this,
			package: package
		});
		match.create
		({
			control: config.demo_mode?null:session.control.f,
			player: get_players(),
			background: { id: get_background() },
			set: {
				weapon:true,
				demo_mode:config.demo_mode
			}
		});
		return match;

		function get_players()
		{
			var players = config.players;
			var arr = [];
			for( var i=0; i<players.length; i++)
			{
				if( players[i].use)
					arr.push({
						name: players[i].name,
						controller: players[i].type==='human'?session.control[i]:{type:'AIscript',id:AI_list[players[i].selected_AI].id},
						id: char_list[players[i].selected].id,
						team: players[i].team===0? 10+i : players[i].team
					});
			}
			return arr;
		}
		function get_background()
		{
			var options = config.options;
			if( options.background===-1)
				return bg_list[Math.floor(randomseed.next()*bg_list.length)].id;
			else
				return bg_list[options.background].id;
		}
	}
	this.start_debug=function()
	{
		var match = this.start_match({
			players:[
				{
					use:true,
					name:'Player1',
					type:'human',
					selected:3,
					team:1
				},
				{
					use:true,
					name:'Player2',
					type:'human',
					selected:4,
					team:2
				}
			],
			options:{
				background:-1, //random
				difficulty:2 //difficult
			}
		});
	}
	this.start_demo=function()
	{
		var This=this;
		util.div('top_status').innerHTML="F.LF is running in Demo mode, press `Esc` or click <button class='here_button' style='width:100px;letter-spacing:3px;'>here</button> to start game.";
		util.div('here_button').onclick=start_game;
		function start_game()
		{
			match.destroy();
			util.div('top_status').innerHTML="";
			This.switch_UI('frontpage');
		}
		session.control.f.child=[{
			key:function(K,D){if(K==='esc'&&D){start_game();}}
		}];
		session.control.f.sync=false;
		var match = this.start_match({
			demo_mode:true,
			players:[
				{
					use:true,
					name:'CRUSHER',
					type:'computer',
					selected:5,
					selected_AI:0,
					team:1
				},
				{
					use:true,
					name:'dumbass',
					type:'computer',
					selected:0,
					selected_AI:2,
					team:2
				}
			],
			options:{
				background:-1, //random
				difficulty:2 //difficult
			}
		});
	}
	//constructor
	this.create();
}

//util
function show(div)
{
	div.style.display='';
}
function hide(div)
{
	div.style.display='none';
}
function show_hide(div)
{
	div.style.display= div.style.display===''?'none':'';
}
function defined(x)
{
	return x!==undefined && x!==null;
}
function point_in_rect(x,y,R)
{
	return (inbetween(x,R[0],R[0]+R[2]) && inbetween(y,R[1],R[1]+R[3]));
	function inbetween(x,L,R)
	{
		var l,r;
		if ( L<=R) { l=L; r=R; }
		else { l=R; r=L; }
		return x>=l && x<=r;
	}
}
function create_textbox(config)
{
	var box = new Fsprite_dom({
		canvas: config.canvas,
		xywh: config.xywh
	});
	box.el.classList.add('textbox');
	if( config.color)
		box.el.style.color = config.color;
	box.el.style['line-height'] = config.xywh[3]+'px';
	return box.el;
}
function vertical_menu_dialog(config)
{
	var This = this;
	var data = this.data = config.data;
	this.dia = new Fsprite_dom({canvas:config.canvas, type:'group'});
	this.bg = new Fsprite_dom({canvas: this.dia, img: data.bg});
	this.menu = new Fsprite_dom({canvas: this.dia, img: data.pic});
	this.it = new Fsprite_dom({canvas: this.dia, img: data.pic});
	this.dia.set_x_y(data.x,data.y);
	for( var I in {bg:0,menu:0})
		this[I].set_x_y(0,0);
	for( var I in {dia:0,bg:0,menu:0})
		this[I].set_w_h(data.width,data.height);
	if( config.mousehover)
	{	//activate items automatically by mouse hovering
		var trans=function(el,e)
		{
			var rect = el.getBoundingClientRect();
			var x = e.clientX - rect.left - el.clientLeft + el.scrollLeft;
			var y = e.clientY - rect.top - el.clientTop + el.scrollTop;
			return {x:x,y:y}
		}
		this.dia.el.onmousemove=function(e)
		{
			e=e?e:event;
			var P = trans(this,e);
			This.mousemove(P.x,P.y);
		}
		this.dia.el.onmouseout=function(e)
		{
			This.mousemove(-10,-10);
		}
		this.it.hide();
		if( config.onclick)
		{
			this.onclick = config.onclick;
			this.dia.el.onmousedown=function(e)
			{
				e=e?e:event;
				var P = trans(this,e);
				This.mousedown(P.x,P.y);
			}
		}
	}
	else
	{
		this.activate_item(0);
	}
}
var vmdp = vertical_menu_dialog.prototype;
vmdp.activate_item = function(num)
{
	if( num!==null && num!==undefined)
		this.active_item = num;
	else
		num = this.active_item;
	var item = this.data.item[num];
	this.it.set_x_y(item[0],item[1]);
	this.it.set_img_x_y(-this.data.width-item[0],-item[1]);
	this.it.set_w_h(item[2],item[3]);
}
vmdp.nav_up = function()
{
	if( this.active_item>0)
		this.active_item--;
	else
		this.active_item = this.data.item.length-1;
	this.activate_item();
}
vmdp.nav_down = function()
{
	if( this.active_item<this.data.item.length-1)
		this.active_item++;
	else
		this.active_item = 0;
	this.activate_item();
}
vmdp.show = function()
{
	this.dia.show();
}
vmdp.hide = function()
{
	this.dia.hide();
}
vmdp.get_mouse_target = function(x,y)
{
	var target;
	for( var i=0; i<this.data.item.length; i++)
	{
		if( point_in_rect(x,y,this.data.item[i]))
		{
			target = i;
			break;
		}
	}
	return target;
}
vmdp.mousemove = function(x,y)
{
	var target = this.get_mouse_target(x,y);
	if( defined(target))
	{
		this.activate_item(target);
		this.it.show();
	}
	else
	{
		this.it.hide();
	}
}
vmdp.mousedown = function(x,y)
{
	var target = this.get_mouse_target(x,y);
	if( this.onclick && defined(target))
		this.onclick(target);
}
function horizontal_number_dialog(config)
{
	var This = this;
	var data = this.data = config.data;
	this.dia = new Fsprite_dom({canvas:config.canvas, type:'group'});
	this.dia.set_x_y(data.x,data.y);
	this.bg = new Fsprite_dom({canvas: this.dia, img: data.bg});
	this.bg.set_x_y(0,0);
	for( var I in {dia:0,bg:0})
		this[I].set_w_h(data.width,data.height);
	this.it = [];
	this.active_item = 0;
	for( var i=0; i<=7; i++)
	{
		var sp = new Fsprite_dom({canvas: this.dia});
		sp.set_x_y(data.item_x+i*data.item_space, data.item_y);
		sp.set_w_h(data.item_width, data.item_height);
		sp.el.classList.add('textbox');
		sp.el.style['line-height'] = data.item_height+'px';
		sp.el.innerHTML = i+'';
		this.it[i] = sp;
	}
}
var hndp = horizontal_number_dialog.prototype;
hndp.init = function(lower_bound,upper_bound)
{
	for( var i=0; i<this.it.length; i++)
		this.it[i].el.style.color=this.data.inactive_color;
	for( var i=lower_bound; i<=upper_bound; i++)
		this.it[i].el.style.color=this.data.active_color;
	this.activate_item(lower_bound);
	this.lower_bound = lower_bound;
	this.upper_bound = upper_bound;
}
hndp.activate_item = function(num)
{
	var it = this.it[this.active_item];
	it.el.style.border='';
	this.active_item = num;
	var it = this.it[this.active_item];
	it.el.style.border='1px solid white';
}
hndp.nav_left = function()
{
	this.activate_item(
		this.active_item>this.lower_bound ?
			this.active_item-1
		:
			this.upper_bound
		);
}
hndp.nav_right = function()
{
	this.activate_item(
		this.active_item<this.upper_bound ?
			this.active_item+1
		:
			this.lower_bound
		);
}
hndp.show = function()
{
	this.dia.show();
}
hndp.hide = function()
{
	this.dia.hide();
}
function summary_dialog(config)
{
	var data = this.data = config.data;
	this.status_colors = [data.text_color[6], data.text_color[7]];
	this.dialog = new Fsprite_dom({
		div: config.div,
		type: 'group',
		wh:{w:data.width, h:100}
	});
	this.hide();
	for( var part in {'head':1,'foot':1})
	{
		this[part+'_holder'] = new Fsprite_dom({
			canvas: this.dialog,
			type: 'group'
		});
		this[part] = new Fsprite_dom({
			canvas: this[part+'_holder'],
			img: data.pic,
			wh:{w:data.width, h:data[part][3]}
		});
		this[part].set_img_x_y(-data[part][0], -data[part][1]);
	}
	this.rows=[]
	for( var i=0; i<8; i++)
	{
		var gp = new Fsprite_dom({
			canvas: this.dialog,
			type: 'group'
		});
		var bg = new Fsprite_dom({
			canvas: gp,
			img: data.pic,
			wh:{w:data.width, h:data.body[3]}
		});
		bg.set_img_x_y(-data.body[0], -data.body[1]);
		var icon = new Fsprite_dom({
			canvas: gp,
			xywh: data.icon
		});
		this.rows[i] = {
			gp:gp,
			icon:icon,
			boxes:[]
		};
		for( var j=0; j<data.text.length; j++)
		{
			var tb = create_textbox({
				canvas: gp,
				xywh: data.text[j],
				color: data.text_color[j]
			});
			this.rows[i].boxes.push(tb);
		}
		//name
		this.rows[i].boxes[0].style['font-size'] = '10px';
		//status
		this.rows[i].boxes[6].style['font-size'] = '9px';
	}
	this.time = create_textbox({
		canvas: this.foot_holder,
		xywh: data.time,
		color: data.time_color
	});
}
summary_dialog.prototype.show = function()
{
	this.dialog.show();
}
summary_dialog.prototype.hide = function()
{
	this.dialog.hide();
}
summary_dialog.prototype.set_rows=function(num)
{
	var y=this.data.head[3];
	for( var i=0; i<8; i++)
	{
		this.rows[i].gp.set_x_y(0, y);
		if (i<num)
		{
			y += this.data.body[3];
			this.rows[i].gp.show();
		}
		else
			this.rows[i].gp.hide();
	}
	this.foot_holder.set_x_y(0, y);
	y += this.data.foot[3];
	this.dialog.set_h(y);
}
summary_dialog.prototype.set_info=function(info)
{
	/* info=
	[
		[ Icon, Name, Kill, Attack, HP Lost, MP Usage, Picking, Status ]...
	]
	*/
	this.set_rows(info.length);
	for( var i=0; i<info.length; i++)
	{
		this.set_row_data(i, info[i]);
	}
}
summary_dialog.prototype.set_time=function(time)
{
	this.time.innerHTML = time;
}
summary_dialog.prototype.set_row_data=function(i, data)
{
	var row = this.rows[i].boxes;
	var icon = this.rows[i].icon;
	icon.remove_img('0');
	icon.add_img(data[0],'0');
	for( var i=1; i<data.length; i++)
	{
		row[i-1].innerHTML = data[i];
	}
	if( data[7].indexOf('Win')!==-1)
		row[6].style.color = this.status_colors[0];
	else
		row[6].style.color = this.status_colors[1];
}

return Manager;
});

/*\
 * css
 * css is a requirejs plugin that loads a css file and inject it into a page.
 * 
 * note that this loader will return immediately,
 * regardless of whether the browser had finished parsing the stylesheet.
 *
 * this css loader is implemented for file optimization and depedency managment
| requirejs(['css!style.css','css!more.css'],function(css1,css2){
|	console.log(css1+','+css2); //true if successfully loaded
| });
\*/

define('F.core/css',{
	load: function (name, require, load, config) {
		function inject(filename)
		{
			var head = document.getElementsByTagName('head')[0];
			var link = document.createElement('link');
			link.href = filename;
			link.rel = 'stylesheet';
			link.type = 'text/css';
			head.appendChild(link);
		}
		inject(requirejs.toUrl(name));
		load(true);
	},
	pluginBuilder: './css-build'
});

define('F.core/css-embed', function()
{
	function embed_css(content)
	{
		var head = document.getElementsByTagName('head')[0],
		style = document.createElement('style'),
		rules = document.createTextNode(content);
		style.type = 'text/css';
		if(style.styleSheet)
			style.styleSheet.cssText = rules.nodeValue;
		else style.appendChild(rules);
			head.appendChild(style);
	}
	return embed_css;
});

define('F.core/css!LF/application.css', ['F.core/css-embed'], 
function(embed)
{
	embed(
	'.LFroot {  -webkit-user-select: none;  -khtml-user-select: none;  -moz-user-select: none;  -ms-user-select: none;  user-select: none;  overflow: hidden;  position:absolute;  left:0px; top:0px;  width:100%; height:100%; } .container {  position:absolute;  left:0px; top:0px;  font-family:Arial,sans;  font-size:18px; } .maximized .frontpage_content {  position:absolute;  left:0; top:60px;  right:0; bottom:0;  width:794px;  height:550px;  margin:auto; } .frontpage_text {  position:absolute;  font-family:Helvetica,sans-serif;  font-weight:bold;  font-size:13.3px;  letter-spacing:0.25px;  line-height:20px;  color:#5077d0;  text-align:left;  padding:0 8px 5px 8px;  z-index:10; } .frontpage_text a {  text-decoration:none;  color:#5077d0; } .frontpage_text .number {  letter-spacing:0.5px; } .window {  position:relative;  width:794px;  height:550px;  border:5px solid #676767; } .window > div, .canvas {  position:absolute;  left:0; top:0;  right:0; bottom:0; } .bgviewer .window {  height:400px; } .wideWindow .window {  height:422px; } .maximized .window {  border: none; } .window_caption {  position:relative;  top:0px;  width:794px; height:30px;  border:5px solid #676767;  border-width:0 5px;  background:#676767;  z-index:10; } .window_caption_title {  font-family:"Segoe UI",Arial,sans;  font-size:20px;  color:#FFF;  width:90%;  text-align:center;  padding:2px 0px 5px 50px;  text-shadow:0px 0px 5px #AAA; } .window_caption_button_bar {  position:absolute;  top:0px; right:0px;  height:100%;  -webkit-user-select: none;  -khtml-user-select: none;  -moz-user-select: none;  -ms-user-select: none;  user-select: none; } .window_caption_button_bar > * {  background:#1878ca;  /* blue:#1878ca, red:#c74f4f; */  float:right;  width:auto; height:85%;  padding:0 10px 0 10px;  margin-right:10px;  text-align:center;  text-decoration:none;  font-size:10px;  color:#FFF;  cursor:pointer; } .window_caption_button_bar > *:hover {  background:#248ce5; } .unisym {  font-family: Arial Unicode MS, FreeSerif, serif;  font-size: 18px; } .ProjectFbutton {  background:#7c547c; } .ProjectFbutton a {  text-decoration:none;  color:#FFF; } .ProjectFbutton:hover {  background:#9d6e9d; } .gameplay {  z-index:1; } .panel {  position:absolute;  left:0; top:0;  width:100%; height:128px;  z-index:2; } .background {  position:absolute;  left:0; top:0;  width:100%; height:550px;  z-index:-1;  overflow:hidden; } .maximized .background {  overflow:visible; } .bgviewer .background {  top:-128px; } .top_status {  position:absolute;  background:#000;  left:0; top:106px;  width:100%; height:22px;  line-height:22px;  font-family:"MS PMincho",monospace;  font-size:14px;  font-weight:bold;  color:#FFF; } .top_status button {  padding:0 10px; } .wideWindow .top_status {  opacity: 0.5; } .bottom_status {  position:absolute;  bottom:0px;  width:100%; height:22px;  line-height:22px;  background:#000;  text-align:right; } .fps {  float:left;  border:none;  background:none;  width:50px;  color:#FFF;  padding:0 5px 0 5px; } .footnote {  font-family:"MS PMincho",monospace;  font-size:12px;  text-shadow: 0px -1px 2px #666, 1px 0px 2px #666, 0px 2px 2px #666, -2px 0px 2px #666;  letter-spacing:2px;  color:#FFF; } .backgroundScroll {  position:absolute;  width:100%;  top:550px;  overflow-x:scroll;  overflow-y:hidden; } .maximized .backgroundScroll {  display:none; } .wideWindow .backgroundScroll {  top:422px; } .backgroundScrollChild {  position:absolute;  left:0; top:0;  height:1px; } .bgviewer .backgroundScroll {  top:400px;  z-index:10; } .window_message_holder {  position:absolute;  left:0; top:0;  width:100%; height:100%; } .window_message_holder > div {  position:absolute;  left:0; top:0;  right:0; bottom:0;  margin:auto; } .error_message {  color:#F00;  height:20%;  text-align:center; } .touch_control_holder {  position:absolute;  left:0px; top:0px; } .touch_controller_button {  position:absolute;  border:2px solid rgba(170, 255, 255, 0.5);  display:table;  color:#FFF;  font-size:20px;  opacity:0.5;     transition:left 0.5s; } .touch_controller_button > span {  display:table-cell;  vertical-align:middle;  text-align:center; } .projectFmessage {  display:none; } .character_selection {  z-index:2; } .settings {  z-index:3;  font-size:16px; } .textbox, .settings {  font-family:Helvetica,sans-serif;  font-weight:bold;  color:#FFF; } .textbox {  text-align:center;  font-size:13px; } .keychanger {  position:absolute;  left:70px; top:160px;  text-align:center; } .keychanger td {  background: #000;  width: 120px; } .settings .note {  color:#5a77d8; } .network_game_menu {  position:absolute;  left:180px; top:230px; } .server_select, .network_game button, .network_game input {  background:#1e337a;  font-family:Helvetica,sans-serif;  font-weight:bold;  font-size:14px;  color:#FFF;  border:1px solid #FFF;  padding:10px 20px; } .server_select {  width:250px; } .network_game button {  width:95px; } .server_address {  width:410px; } .network_log {  width:445px;  height:200px;  text-align:left;  background:none;  border:none;  color:#FFF;  font-family:monospace;  font-size:14px;  resize:none; } .enable_sound {  position:absolute;  left:120px; top:400px;  width:280px;  z-index:2; } .character_selection_textbox {     transition:color 0.1s; } .menu_dialog_textbox {  text-align:left;  padding-left:5px; } .lobby {  position:absolute;  left:0; top:0;  width:100%; height:100%;  z-index:10; } '
	);
	return true;
});

(function (){

if( document.getElementById('flf-config'))
{
	var flf_config = document.getElementById('flf-config').innerHTML;
	flf_config = JSON.parse(flf_config);
	requirejs.config(
	{
		baseUrl: flf_config.location || '',
		paths:
		{
		},
		config:
		{
		}
	});
}

requirejs(['F.core/support',
'LF/loader!'+flf_config.package,'LF/manager',
'LF/util','F.core/css!LF/application.css'],
function(Fsupport,
package,Manager,
util){

	if(typeof(console) === 'undefined') {
		console = {};
		console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
	}

	console.log(util.div('projectFmessage').innerHTML);

	//analytics
	if( window.location.href.indexOf('http')===0)
	{
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','http://www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-37320960-5', 'tyt2y3.github.io');
		ga('send', 'pageview');
	}

	requirejs(['./buildinfo.js'],function(buildinfo){
		util.div('footnote').innerHTML+=
			(buildinfo.timestamp==='unbuilt'?'unbuilt demo':'built on: '+buildinfo.timestamp);
	});

	var manager = new Manager(package);
	var param = util.location_parameters();
	if( param)
	{
		if( param.max)
			util.div('maximizeButton').onclick();
	}

});

}());

define("LF/demo/demo5", function(){});
