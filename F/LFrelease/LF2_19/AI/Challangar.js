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

			
			//for testing controller.keypress('att'); controller.keypress('jump'); console.log("after for"); console.log(target);
			//TODO update min_opponent_doging_dis? dash_and_attack?
			/* Known info
				attacks:DfA DdA DfJ DuJA dash_and_attack
				AI.js is useful
				
if(opponent not blinking)
	if(mp has more && same z && dx <= min_opponent_doging_dis)
		if(dx is large)
			DfA
		else if(dx is medium)
			DfJ
		else
			DdA
	else
		dash diag+attack
else
	get away from it diagonally

			*/
			approach(opponent.ps.x, opponent.ps.y, true);
			controller.keypress('att');
		}
		
//ooooooooooooooooooooooooooooooooooooooooooooooooold stuff
		function get_to(min_x,max_x,min_z,max_z)
		{
			var dx = max(self.ps.x - max_x, min_x - self.ps.x);
			var dz = max(self.ps.z - max_z, min_z - self.ps.z);
			//var angle = atan2(var(dz), var(dx));
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
		function approach(x, y, bool)
		{
			if( (x > myself.ps.x && bool) || (x < myself.ps.x && !bool) )
			{
				controller.keypress('right',1,1);
			}
			else
			{
				controller.keypress('left',1,1);
			}
		}
//moves

//tools
		function about(x)
		{ 
			return x + rand(x/10) - x/20; 
		}
		function rand(i)
		{
			return Math.floor(match.random()*i);//from third_party/random.js
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
		function facing_opponent()
		{
			return (self.AI.facing() && opponent.ps.x < self.ps.x) ||
				(!self.AI.facing() && opponent.ps.x > self.ps.x);
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