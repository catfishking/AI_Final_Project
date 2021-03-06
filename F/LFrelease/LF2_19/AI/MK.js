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
		this.name = 'QAQ 10.6.8';
		this.designed_for = ['Davis'];//****
		this.author = 'QAQQQ';
		
		var game_objects = match.scene.live;
		var opponent;
		var DfA_cost = 40, DdA_cost = 75, DuA_cost = 225, DuJA_cost = 25;
		var MK_DfA_rang = 50, MK_DdA_rang = 90, MK_DuA_rang = 60, MK_runA_rang = 150;
		var MK_z_range = 12, MK_flag_for_11 = true;
		
		function id() 
		{
			reset_keys();
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
	//		print("self//"+self.state());print("oppo//"+opponent.state());	
			switch(opponent.state())
			{
				case 0://standing
				case 1://walking
					if(MK_z_inrange())
					{
						if(self.state() === 2 && x_distance_to_opponent() < MK_runA_rang )
						{
							controller.keypress('att',1,1);
						}
						else if(self.health.mp > DuA_cost && x_distance_to_opponent() < MK_DuA_rang  )
						{
							DuA();
						}
						else if(self.health.mp > DdA_cost && x_distance_to_opponent() < MK_DdA_rang )
						{
							DdA();
						}
						else if(self.health.mp > DfA_cost && x_distance_to_opponent() < MK_DfA_rang )
						{
							DfA();
						}
						else if(opponent.ps.x - self.ps.x > 0)
						{
							controller.keypress('right',1,1);
							if(MK_probability(about(25)))
							{
								controller.keypress('att',1,1);
							}
						}
						else
						{
							controller.keypress('left',1,1);
							if(MK_probability(about(25)))
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
					if(MK_z_inrange())
					{
						if(self.state() === 2 && x_distance_to_opponent() < (MK_runA_rang*1.5))
						{
							controller.keypress('att',1,1);
						}
						else if(self.state() <= 1 && x_distance_to_opponent() < MK_runA_rang)//** oppo running
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
					if(MK_z_inrange())
					{
						if(self.state() === 2 && x_distance_to_opponent() < MK_runA_rang)
						{
							controller.keypress('att',1,1);
						}
						else if(self.state() <= 1 && x_distance_to_opponent() < MK_runA_rang)//** oppo running
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
					if(MK_z_inrange())
					{
						if(self.state() <= 1 && x_distance_to_opponent() < MK_DuA_rang)
						{
							DuA();
						}
						else if(self.state() <= 1 && x_distance_to_opponent() < MK_DdA_rang)
						{
							DdA();
						}
						else if(self.state() === 2 && x_distance_to_opponent() < MK_runA_rang)
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
					if(MK_z_inrange() && self.state() <= 1)
					{
						DfA();
					}
					else
					{
						controller.keypress('att',1,1);
					}
					break;
				case 7://defend
					if(MK_z_inrange())
					{
						if(self.health.mp > DuA_cost && x_distance_to_opponent() < MK_DuA_rang)
						{
							DuA();
						}
						else if(self.health.mp > DdA_cost && x_distance_to_opponent() < MK_DdA_rang)
						{
							DdA();
						}
						else if(self.health.mp > DfA_cost && MK_probability(about(40)))
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
					if(MK_flag_for_11 && self.health.mp >= DdA_cost)
					{
						DdA();
						MK_flag_for_11 = false;
					}
					else if(self.health.mp >= DuA_cost)
					{
						DuA();
						MK_flag_for_11 = true;
					}
					else
					{
						controller.keypress('att',1,1);
						MK_flag_for_11 = true;
					}
					break;
				case 12://in the air
					if(self.health.mp >= DfA_cost && MK_probability(30))
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
						if(MK_z_inrange())
						{
							if(self.state() === 2 && x_distance_to_opponent() < MK_runA_rang)
							{
								controller.keypress('att',1,1);
							}
							else if(self.state() <= 1 && x_distance_to_opponent() < MK_DfA_rang)
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
			if(x_distance_to_opponent() < z_distance_to_opponent()*3 || MK_probability(20))
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
		function MK_z_inrange()
		{
			return abs(opponent.ps.z - self.ps.z) < MK_z_range;
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
		function MK_probability(p)
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