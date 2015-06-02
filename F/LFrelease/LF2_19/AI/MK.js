/*
references:
http://www.masterbaboon.com/2009/04/my-ai-can-read-your-mind-part-1/
http://www.masterbaboon.com/2009/05/my-ai-reads-your-mind-and-kicks-your-ass-part-2/
http://www.masterbaboon.com/2009/09/my-ai-reads-your-mind-extensions-part-3/

*/

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
		this.designed_for = ['Dais'];//****
		this.author = 'MK';
		
		var game_objects = match.scene.live;

		var min_dash_dx;
		var max_dash_dx;
		var min_dash_dz;
		var max_dash_dz;
		var max_dash_blink;
		var run_stop_distance;
		
		var opponent, myself = self;
		var DfA_cost = 40, DdA_cost = 75, DuA_cost = 225, DuJA_cost = 25;
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
			
			//for testing controller.keypress('att'); controller.keypress('jump'); console.log("after for"); console.log(target); approach(opponent.ps.x, opponent.ps.z, true);
			/* Known info
				attacks:DfA DdA DuA DuJA(close to complete) runA(not even started)
				x-right+ z-down+
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
		approach //update: distinguish between approach and flee
else
	flee
			*/
			
			//TODO (update min_opponent_doging_dis)? dash_and_attack? z_range?
			
			if(opponent.AI.blink() <= 1 && !flee_flag)
			{
				console.log("in if");
				if( z_inrange() && (x_distance_to_opponent() <= min_opponent_doging_dis) )
				{	
					console.log("if again");
					var temp_x = x_distance_to_opponent();
					if(temp_x >= large_x_dis && myself.health.mp >= DfA_cost)
					{
						console.log("DfA");
						DfA();
					}
					else if(temp_x >= medium_x_dis && myself.health.mp >= DfJ_cost)
					{
						console.log("DfJ");
						DfJ();
					}
					else
					{
						console.log("DdA");
						DdA();
					}
				}
				else
				{
					console.log("aaing");
					approach(opponent.ps.x, opponent.ps.z);
				}
			}
			else
			{
				console.log("aaaaaaaaaaaaing");
				flee_flag = true;
				flee(opponent.ps.x, opponent.ps.z);
				if(distance_to_opponent() >= 150*150 || opponent.AI.blink()<=1)
				{
					flee_flag = false;
				}
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
		function DuA()
		{
			if(opponent.ps.x - myself.ps.x > 0)
			{
				controller.keyseq(['right','def','up','jump']);
			}
			else
			{
				controller.keyseq(['left','def','up','jump']);
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
			if(x_distance_to_opponent() > z_distance_to_opponent())
			{
				if( x > myself.ps.x )
				{
					controller.keypress('right',1,1);
				}
				else
				{
					controller.keypress('left',1,1);
				}
			}
			else
			{
				if( z > myself.ps.z )
				{
					controller.keypress('down',1,1);
				}
				else
				{
					controller.keypress('up',1,1);
				}
			}
		}
		function flee(x,z)
		{
			if(x_distance_to_opponent() < z_distance_to_opponent())
			{
				if( x < myself.ps.x )
				{
					controller.keypress('right',1,1);
				}
				else
				{
					controller.keypress('left',1,1);
				}
			}
			else
			{
				if( z < myself.ps.z )
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