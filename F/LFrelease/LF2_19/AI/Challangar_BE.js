define(
function()
{
	function abs(x) {return x>0?x:-x;}
	function clr() {}
	function print(x)
	{
		//console.log('AI:'+x);
	}
	function AIscript(self,match,controller)
	{
		// CHALLANGAR 1.0
		// Designed for Deep *** hopefully...
		// Usually beats standard Difficult AI
		// based on Zort's, revised by MK
		this.name = 'MEIKON 1.0';
		this.designed_for = ['Deep'];//****
		this.author = 'Zort&MK';
		
		var game_objects = match.scene.live;

		var min_dash_dx;
		var max_dash_dx;
		var min_dash_dz;
		var max_dash_dz;
		var max_dash_blink;
		var run_stop_distance;
		
		var opponent, myself = self;
		var DfA_cost = 75, DdA_cost = 75, DfJ_cost = 150, DuJA_cost = 75;
		var DuJA_flag = false;//DuJA needs delay
		var dash_and_attack_flag = false;//dash towards and attack
		var min_opponent_doging_dis = 200;
		var flee_flag = false;
		var z_range = 10, large_x_dis = 30, medium_x_dis = 15;
		
		function id() 
		{
			reset_keys();
			
			min_dash_dx = about(70);
			max_dash_dx = about(230);
			min_dash_dz = about(5);
			max_dash_dz = about(40);
			max_dash_blink = 5;
			run_stop_distance = about(30);
			
			for (var i in game_objects)//got opponent and myself
			{ 
				if (identify(i) == 0)//get opponent
				{
					if(game_objects[i].uid != myself.uid)
					{
						opponent = game_objects[i];
					}
				}
			}
			if(self.state()===14)//14:lying
				return;
		/*	if(opponent.AI.blink() || opponent.state()===14){
				console.log('kai you lo?');
				flee(opponent.ps.x,opponent.ps.z);
				return;
			}
			if(face_opponent()){
				return;
			}
			if(opponent.AI.blink() <= 1 && !flee_flag)
			{
		//			var toward = facing_opponent()? 'left':'right';
				//console.log(self.ps.dir);
				if(x_distance_to_opponent() <= 75){
					controller.keypress('att');
				}					
			}*/
			
	//		console.log('x:',x_distance_to_opponent(),' z:',z_distance_to_opponent());
			
			console.log(opponent.state());
			switch(opponent.state() ){
				case 0://standing
					approach(opponent.ps.x,opponent.ps.z);
					attack();
					break;
				case 1://walking
					approach(opponent.ps.x,opponent.ps.z);
					attack();
					break;
				case 2://running
					approach(opponent.ps.x,opponent.ps.z);
					attack();
					break;
				case 3://attack
					controller.keypress('jump');
					controller.keypress('att');
					break;
				case 4://jump
					approach(opponent.ps.x,opponent.ps.z);
					attack();
					break;
				case 5://small jump ; dash
					attack();
					break;
				case 6://rowing
					approach(opponent.ps.x,opponent.ps.z);
					attack();
					break;
				case 7://defending
					approach(opponent.ps.x,opponent.ps.z);
					attack();
					break;
				case 8://broken defend
					controller.keypress('att');
					break;
				case 9://catching
					break;
				case 10://being caught
					controller.keypress('att');
					break;
				case 11://injured
					controller.keypress('att');
					break;
				case 12://falling
					approach(opponent.ps.x,opponent.ps.z);
					attack();
					break;
				case 14://lying
					flee(opponent.ps.x,opponent.ps.z);
					break;
				case 15://return move
					approach(opponent.ps.x,opponent.ps.z);
					attack();
					break;
				case 16:
					controller.keypress('att');
					break;
				default:
					controller.keypress('jump');
					break;
			}
		}

//ooooooooooooooooooooooooooooooooooooooooooooooooold stuff
		function get_to(min_x,max_x,min_z,max_z)
		{
			var dx = max(self.ps.x - max_x, min_x - self.ps.x);
			var dz = max(self.ps.z - max_z, min_z - self.ps.z);
			var run = (dx > run_stop_distance || abs(self.ps.x - target.ps.x) < 100) ? 0 : 1;

			if (self.ps.x > max_x)
			{
				controller.keypress('left',1,run);
				if( run===0) 
				{
					controller.keypress('left',1,run);
				}
			}
			else if (self.ps.x < min_x) 
			{
				controller.keypress('right',1,run);
				if( run===0) 
				{
					controller.keypress('right',1,run);
				}
			}

			if (self.ps.z > max_z) 
			{
				controller.keypress('up',1,run);
			}
			else if (self.ps.z < min_z) 
			{
				controller.keypress('down',1,run);
			}
		}   

		function ready_to_dash()
		{
			// four acceptable regions to dash from
			var dx = abs(target.ps.x - self.ps.x);
			var dz = abs(target.ps.z - self.ps.z);
			return (self.state() == 0 || self.state() == 1 || self.state() == 2 || self.frame.N == 215) &&
				(target.state() != 14 && target.AI.blink() < 2) && 
				((min_dash_dx <= dx && dx <= max_dash_dx) && (min_dash_dz <= dz && dz <= max_dash_dz) ||
				 (facing_target() && self.state() == 2));
		}
//=================================================================================		

//attacks
	

		function attack()
		{
		 if(z_distance_to_opponent() < 10){
			 if(self.state() === 2){
				 if(x_distance_to_opponent() < 130)
					 controller.keypress('att');
			 }
			else if(x_distance_to_opponent() < 60)
				controller.keypress('att');			 
		 }
		}

		function DfA()
		{
			if(opponent.ps.x - myself.ps.x > 0)
			{
				controller.keyseq(['def','right','att']);
			}
			else
			{
				controller.keyseq(['def','left','att']);
			}
		}
		function DdA()
		{
			controller.keyseq(['def','down','att']);
		}
		function DfJ()
		{
			if(opponent.ps.x - myself.ps.x > 0)
			{
				controller.keyseq(['def','right','jump']);
			}
			else
			{
				controller.keyseq(['def','left','jump']);
			}
		}
		function DuJA()
		{
			if(opponent.ps.x - myself.ps.x > 0)
			{
				controller.keypress('right');
				controller.keyseq(['def','up','jump']);
			}
			else
			{
				controller.keypress('left');
				controller.keyseq(['def','up','jump']);
			}
		}
//attacks

//moves
		function approach(x, z)//x->+ z-down+
		{
			if(x_distance_to_opponent() > 320){
				if( x > self.ps.x )
					controller.keypress('right',1,1);
				else
					controller.keypress('left',1,1);
			}
			else{
				if(x > self.ps.x)
					controller.keypress('right',1,0);
				else
					controller.keypress('left',1,0);
			}
			if(z_distance_to_opponent() > 5){
				if( z > self.ps.z)
					controller.keypress('down',1,1);
				else
					controller.keypress('up',1,1);
			}
		}

		function flee(x,z)
		{
			controller.keypress('jump');
			if(x_distance_to_opponent() < 100)
			{
				console.log('flee1');
				if( x >= myself.ps.x && myself.ps.x!==0)
				{
					controller.keypress('left',1,1);
				}
				else
				{
					controller.keypress('right',1,1);
				}
			}
			if(z_distance_to_opponent() < 20)
			{
				console.log('flee2','dis:',z_distance_to_opponent(),'  z',z,' my_z:',self.ps.z);
				if( z <= myself.ps.z && myself.ps.z!==510)
				{
					controller.keypress('down',1,1);
				}
				else
				{
					controller.keypress('up',1,1);
				}
			}
		}

//moves

//tools
		function about(x)//old tool
		{ 
			return x + rand(x/10) - x/20; 
		}
		function rand(i)//old tool from third_party/random.js
		{
			return Math.floor(match.random()*i);
		}
		function z_inrange()
		{
			return abs(opponent.ps.x - myself.ps.x) < z_range;
		}
		function identify(i)
		{
			if( game_objects[i])
			{
				return game_objects[i].AI.type();
			}
			return -1;
		}		
		function probability(p)
		{
			return Math.floor(Math.random()*100) < p;
		}
		function x_distance_to_opponent()
		{
			return abs(opponent.ps.x - myself.ps.x);
		}
		function z_distance_to_opponent()
		{
			return abs(opponent.ps.z - myself.ps.z);
		}
		function distance_to_opponent()
		{
			return (opponent.ps.z - myself.ps.z)*(opponent.ps.z - myself.ps.z) + (opponent.ps.x - myself.ps.x)*(opponent.ps.x - myself.ps.x);
		}
		function facing_opponent()
		{
			return (self.AI.facing() && opponent.ps.x < self.ps.x) ||
				(!self.AI.facing() && opponent.ps.x > self.ps.x);
		}
		function face_opponent()
		{
			if(!facing_opponent()){
				if(self.ps.dir==='left'){
					console.log("press right");
					controller.keypress('right');}
				else{
					console.log('press left');
					controller.keypress('left');}
				return 1;
			}
			return 0;

		}

		function reset_keys()
		{
			controller.keypress('att',0,0);
			controller.keypress('def',0,0);
			controller.keypress('jump',0,0);
			controller.keypress('up',0,0);
			controller.keypress('down',0,0);
			controller.keypress('left',0,0);
			controller.keypress('right',0,0);
		}		
		function max(a,b)
		{ 
			return (a>b)? a:b;
		}
//tools

		this.TU = id;
	}
	AIscript.type = AIscript.prototype.type = 'AIscript';
	return AIscript;
}

);
