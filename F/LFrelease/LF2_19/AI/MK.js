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
		console.log('MKAI:'+x);
	}
	function AIscript(self,match,controller)
	{
		// CHALLANGAR 1.0
		// Designed for Deep *** hopefully...
		// Usually beats standard Difficult AI
		// based on Zort's, revised by MK
		this.name = 'MEIKON 1.0';
		this.designed_for = ['Davis'];//****
		this.author = 'MK';
		
		var game_objects = match.scene.live;

		var min_dash_dx;
		var max_dash_dx;
		var min_dash_dz;
		var max_dash_dz;
		var max_dash_blink;
		var run_stop_distance;
		
		var opponent;
		var DfA_cost = 40, DdA_cost = 75, DuA_cost = 225, DuJA_cost = 25;
		var DfA_rang = 50, DdA_rang = 90, DuA_rang = 60, runA_rang = 150;
		var z_range = 12, flag_for_11 = true;
		
		function id() 
		{
			reset_keys();
						
			min_dash_dx = about(70);
			max_dash_dx = about(230);
			min_dash_dz = about(5);
			max_dash_dz = about(40);
			max_dash_blink = 5;
			run_stop_distance = about(30);
			
			for (var i in game_objects)//got opponent
			{ 
				if (identify(i) == 0)//get opponent
				{
					if(game_objects[i].uid != self.uid)
					{
						opponent = game_objects[i];
					}
				}
			}
			
			//for testing controller.keypress('att'); controller.keypress('jump'); console.log("after for"); console.log(target); approach(opponent.ps.x, opponent.ps.z, true);
			/* Known info
				attacks:DfA DdA DuA DuJA runA JfA
				x-right+ z-down+
				AI.js is useful
				state 0 standing, 1 is walking, 2 is running, 
				3 is attacking, 4 is jump, 5 is leap
				6 is rolling, 7 is defend, 8 broken defense, 9 is caught someone
				10 is get caught, 11 is get hit, 12 is in the air, 13 none
				14 is on the ground, 15 is getting up, 16 is stomachache
				ctimer=catching timer
				catch and DuA
				opponent flying blast it 
			*/
	//		print("self//"+self.state());			
	//		print("oppo//"+opponent.state());			
			//TODO (update min_opponent_doging_dis)? dash_and_attack? z_range?			
			switch(opponent.state())
			{
				case 0://standing
				case 1://walking
					if(z_inrange())
					{
						if(self.state() === 2 && x_distance_to_opponent() < runA_rang )
						{
							controller.keypress('att',1,1);
						}
						else if(self.health.mp > DuA_cost && x_distance_to_opponent() < DuA_rang  )
						{
							DuA();
						}
						else if(self.health.mp > DdA_cost && x_distance_to_opponent() < DdA_rang )
						{
							DdA();
						}
						else if(self.health.mp > DfA_cost && x_distance_to_opponent() < DfA_rang )
						{
							DfA();
						}
						else if(opponent.ps.x - self.ps.x > 0)
						{
							controller.keypress('right',1,1);
							if(probability(about(25)))
							{
								controller.keypress('att',1,1);
							}
						}
						else
						{
							controller.keypress('left',1,1);
							if(probability(about(25)))
							{
								controller.keypress('att',1,1);
							}
						}	
					}
					else
					{
						if(opponent.ps.z - self.ps.z > 0)
						{
							controller.keypress('down',1,1);
						}
						else
						{
							controller.keypress('up',1,1);
						}
					}	
					break;
				case 2://running
					if(z_inrange())
					{
						if(self.state() === 2 && x_distance_to_opponent() < (runA_rang*1.5))
						{
							controller.keypress('att',1,1);
						}
						else if(self.state() <= 1 && x_distance_to_opponent() < runA_rang)//** oppo running
						{
							DdA();
						}
						else
						{
							DfA();
						}
					}
					else
					{
						if(opponent.ps.z - self.ps.z > 0)
						{
							controller.keypress('down',1,1);
						}
						else
						{
							controller.keypress('up',1,1);
						}
					}
					break;
				case 3://attacking
					//console.log("aaaaaaa");
					if(z_inrange())
					{
						if(self.state() === 2 && x_distance_to_opponent() < runA_rang)
						{
							controller.keypress('att',1,1);
						}
						else if(self.state() <= 1 && x_distance_to_opponent() < runA_rang)//** oppo running
						{
							DdA();
						}
						else
						{
							approach(opponent.ps.x, opponent.ps.z);
						}
					}
					else
					{
						if(opponent.ps.z - self.ps.z > 0)
						{
							controller.keypress('down',1,1);
						}
						else
						{
							controller.keypress('up',1,1);
						}
					}
					break;
				case 4://jump
				case 5://leap
				//	print("55555555555"+z_distance_to_opponent());
					if(z_inrange())
					{
						if(self.state() <= 1 && x_distance_to_opponent() < DuA_rang)
						{
							DuA();
						}
						else if(self.state() <= 1 && x_distance_to_opponent() < DdA_rang)
						{
							DdA();
						}
						else if(self.state() === 2 && x_distance_to_opponent() < runA_rang)
						{
							controller.keypress('att',1,1);
						}
						else
						{
							DfA();
						}
					}
					else
					{
						if(opponent.ps.z - self.ps.z > 0)
						{
							controller.keypress('down',1,1);
						}
						else
						{
							controller.keypress('up',1,1);
						}
					}
					break;
				case 6://rolling
					if(z_inrange() && self.state() <= 1)
					{
						DfA();
					}
					else
					{
						controller.keypress('att',1,1);
					}
					break;
				case 7://defend
					if(z_inrange())
					{
						if(self.health.mp > DuA_cost && x_distance_to_opponent() < DuA_rang)
						{
							DuA();
						}
						else if(self.health.mp > DdA_cost && x_distance_to_opponent() < DdA_rang)
						{
							DdA();
						}
						else if(self.health.mp > DfA_cost && probability(about(40)))
						{
							DfA();
						}
						else
						{
							controller.keypress('att',1,1);
						}
					}
					else
					{
						if(opponent.ps.z - self.ps.z > 0)
						{
							controller.keypress('down',1,1);
						}
						else
						{
							controller.keypress('up',1,1);
						}
					}
					break;
				case 8://broken defense
					controller.keypress('att',1,1);
					break;
				case 9://caught someone
					DfA();
					break;
				case 10://get caught
					if( self.health.mp >= DuA_cost && self.AI.ctimer() < 50)
					{
						DuA();
					}
					else if( self.health.mp >= DdA_cost && self.AI.ctimer() < 50)
					{
						DdA();
					}
					else
					{
						controller.keypress('att',1,1);
					}
					break;
				case 11://get hit
					if(flag_for_11 && self.health.mp >= DdA_cost)
					{
						DdA();
						flag_for_11 = false;
					}
					else if(self.health.mp >= DuA_cost)
					{
						DuA();
						flag_for_11 = true;
					}
					else
					{
						controller.keypress('att',1,1);
						flag_for_11 = true;
					}
					break;
				case 12://in the air
					if(self.health.mp >= DfA_cost && probability(30))
					{
						DfA();
					}
					else
					{
						controller.keypress('right',1,1);
						controller.keypress('att',1,1);
						controller.keypress('right',0,1);
					}
					break;
				case 14://on the ground
					//must be blinking then?
					flee(opponent.ps.x, opponent.ps.z);
					break;
				case 15://getting up
					if(opponent.AI.blink() != 0)
					{
						flee(opponent.ps.x, opponent.ps.z);
					}
					else
					{
						if(z_inrange())
						{
							if(self.state() === 2 && x_distance_to_opponent() < runA_rang)
							{
								controller.keypress('att',1,1);
							}
							else if(self.state() <= 1 && x_distance_to_opponent() < DfA_rang)
							{
								DfA();
							}
							else
							{
								approach(opponent.ps.x, opponent.ps.z);
							}		
						}
						else
						{
							approach(opponent.ps.x, opponent.ps.z);
						}
					}
					break;
				case 16://stomachache
					if(opponent.ps.x - self.ps.x > 0)
					{
						controller.keypress('right',1,1);
					}
					else
					{
						controller.keypress('left',1,1);
					}
					break;
				default:
					controller.keypress('att',1,1);
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
			if(opponent.ps.x - self.ps.x > 0)
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
			if(opponent.ps.x - self.ps.x > 0)
			{
				controller.keyseq(['right','def','down','att']);
			}
			else
			{
				controller.keyseq(['left','def','down','att']);
			}
		}
		function DuA()
		{
			if(opponent.ps.x - self.ps.x > 0)
			{
				controller.keyseq(['right','def','up','att']);
			}
			else
			{
				controller.keyseq(['left','def','up','att']);
			}
		}
		function DuJA()
		{
			if(opponent.ps.x - self.ps.x > 0)
			{
				controller.keyseq(['right','def','up','jump']);
			}
			else
			{
				controller.keyseq(['left','def','up','jump']);
			}
		}
//attacks

//moves
		function approach(x, z)//x->+ z-down+
		{
			if(x_distance_to_opponent() > z_distance_to_opponent())
			{
				if( x > self.ps.x )
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
				if( z > self.ps.z )
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
			if(x_distance_to_opponent() < z_distance_to_opponent()*3 || probability(20))
			{
				if( x > self.ps.x && self.ps.x <= 1500 )
				{
					controller.keypress('left',1,1);
				}
				else
				{
					controller.keypress('right',1,1);
				}
			}
			else
			{
				if( z > self.ps.z && self.ps.z <= 430)
				{
					controller.keypress('down',1,1);
				}
				else
				{
					controller.keypress('up',1,1);
				}
			}
		}
		function run(direction)
		{
			controller.keyseq([direction, direction]);
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
			return abs(opponent.ps.z - self.ps.z) < z_range;
		}
		function identify(i)
		{
			if( game_objects[i])
			{
				return game_objects[i].AI.type();
			}
			return -1;
		}		
		function random(a,b)//a to b-1
		{
			return Math.floor(Math.random()*(b-a)) + a;
		}
		function probability(p)
		{
			return Math.floor(Math.random()*100) < p;
		}
		function x_distance_to_opponent()
		{
			return abs(opponent.ps.x - self.ps.x);
		}
		function z_distance_to_opponent()
		{
			return abs(opponent.ps.z - self.ps.z);
		}
		function distance_to_opponent()
		{
			return (opponent.ps.z - self.ps.z)*(opponent.ps.z - self.ps.z) + (opponent.ps.x - self.ps.x)*(opponent.ps.x - self.ps.x);
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