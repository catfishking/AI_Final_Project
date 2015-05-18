
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

;
define("LF/sprite-select", function(){});

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

//component test of background.js
requirejs.config({
	baseUrl: '../../',
	paths:
	{
	},
	config:
	{
		'F.core/sprite-dom':
		{
			baseUrl: '../../LFrelease/LF2_19/'
		},
		'F.core/sprite-canvas':
		{
			baseUrl: '../../LFrelease/LF2_19/'
		}
	}
});

requirejs([
'LF/global',
'LF/sprite-select',
'LF/background',
'F.core/css!LF/application.css',
'LFrelease/LF2_19/bg/hkc/bg',
'LFrelease/LF2_19/bg/lf/bg',
'LFrelease/LF2_19/bg/sp/bg',
'LFrelease/LF2_19/bg/gw/bg',
'LFrelease/LF2_19/bg/qi/bg',
'LFrelease/LF2_19/bg/ft/bg',
'LFrelease/LF2_19/bg/cuhk/bg',
'LFrelease/LF2_19/bg/thv/bg',
'LFrelease/LF2_19/bg/template/bg'
],function(global,Fsprite,background)
{
	for( var i=4; i<arguments.length; i++)
	{
		var LFwindow = document.getElementById('template').cloneNode(true);
		LFwindow.id='bg'+(i-3);
		document.body.appendChild(LFwindow);
		var canvas = get_canvas();
		var background_layer = new Fsprite({canvas:canvas,type:'group'});
		background_layer.set_x_y(0,-128);
		if( Fsprite.renderer==='DOM')
			background_layer.el.className = 'background';
		new background({
			layers: background_layer,
			scrollbar: util_div('gameplay'),
			standalone: { carousel:'linear', canvas:canvas}
		},arguments[i],1);
	}
	
	function get_canvas()
	{
		if( Fsprite.renderer==='DOM')
		{
			var group = new Fsprite({div:util_div('gameplay'),type:'group'});
			//group.set_w_h(global.application.window.width,global.application.window.height);
			return group;
		}
		else if( Fsprite.renderer==='canvas')
		{
			var canvas_node = util_div('gameplay').getElementsByClassName('canvas')[0];
			canvas_node.width = global.application.window.width;
			canvas_node.height = global.application.window.height;
			return new Fsprite({canvas:canvas_node,type:'group'})
		}
	}
	
	function util_div(classname)
	{
		return LFwindow.getElementsByClassName(classname)[0];
	}
});
define("LF/demo/background", function(){});
