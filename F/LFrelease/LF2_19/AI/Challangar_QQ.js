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
		this.name = 'QAQ 10.6.8';
		this.designed_for = ['Davis'];//****
		this.author = 'QAQQQ';
		
		var game_objects = match.scene.live;
		var opponent, myself = self;
		var DfA_cost = 40, DdA_cost = 75, DuA_cost = 225, DuJA_cost = 25;
		var MK_DfA_rang = 50, MK_DdA_rang = 90, MK_DuA_rang = 60, MK_runA_rang = 150;
		var MK_z_range = 12, MK_flag_for_11 = true;
		var oc_hp=500,op_hp=500,mc_hp=500,mp_hp=500,mc_mp=500;
		var Q = [], R = [], Q_next = [];
//		var q_in2=1<<11,q_ms1=1<<9,q_ms2=2<<9,q_ms3=3<<9,q_mp1=1<<7,q_mp2=2<<7,q_mp3=3<<7,
//				q_x1=1<<4,q_x2=2<<4,q_x3=3<<4,q_x4=4<<4,q_x5=5<<4,q_x6=6<<4,q_y1=1<<3;
//				q_z1=1,q_z2=2,q_z3=3,q_z4=4,q_z5=5;
		var x_dis=0,z_dis=0,Q_state=0, R_state=0,Q_stateP=0,R_stateP=0;
		var flag = false,ud_flag=false,lr_flag=false,stop=false;
		for(var x = 0; x<8197; x++){
			Q[x] = [];
			R[x] = [];
			for(y = 0; y<2049; ++y){
				Q[x][y] = 0;
				R[x][y] = 0;
			}
		}

//		console.log(contents);
		

		function id() 
		{
			if(stop)
				return;

			var R_value=0;
			reset_keys();
			Q_stateP=Q_state;
			Q_state=0;
			flag = false;lr_flag=false;ud_flag=false;
			R_stateP=R_state;
			R_state=0;
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
			op_hp = oc_hp;
			mp_hp = mc_hp;
			oc_hp = opponent.health.hp;
			mc_hp = self.health.hp;
		
			R_value = -oc_hp + op_hp + mc_hp - mp_hp;
//		console.log('Print:',R_value);
//		console.log('??:',R[Q_stateP][R_stateP]);
		if(R_value > R[Q_stateP][R_stateP] || R[Q_stateP][R_state]===0){
			R[Q_stateP][R_stateP] = R_value;
		}

		if(R[Q_stateP][R_stateP] !==0){
			console.log('oh:',oc_hp,' oh_l:',op_hp,' mh:',mc_hp,' mh_l:',mp_hp);
			console.log('R[]',R[Q_stateP][R_stateP]);
			var output = "";
			output += R[Q_stateP][R_stateP].toString()+" ";
			console.log(output);
		}


		if(oc_hp <= 0 || mc_hp <= 0){
			stop = true;
			var output = "";
			for(var i=0;i<8197;++i){
				for(var j=0;j<2049;++j)
					output += R[i][j].toString()+" ";
			}
			console.log(output);
			return;
		}
		



//		console.log('x:',x_distance_to_opponent(),' z:',z_distance_to_opponent());
		x_dis = x_distance_to_opponent();
		z_dis = z_distance_to_opponent();
		Q_state = check_Q_state();//get the current Q state 
//		console.log(Q_state);
//		console.log('sx:',self.ps.x,' sz:',self.ps.z,' ox:',opponent.ps.x,' oz:',opponent.ps.z);
		if(self.ps.x > opponent.ps.x)
			lr_flag = true;
		if(self.ps.z < opponent.ps.z)
			ud_flag = true;


		if(opponent.state === 10){
			controller.keypress('att');
			return;
		}

		if(Math.random()>0.5)
			flag = true;
		if(flag){
			R_state |= (1<<8);
			if(Math.random()>0.5){
				controller.keypress('jump');
				R_state |= (1<<7);
			}
			if(Math.random()>0.5){
				if(ud_flag){
					controller.keypress('up',1,1);
					R_state |= (1<<6);
				}
				else{
					controller.keypress('down',1,1);
					R_state |= (1<<5);
				}
			}
			if(Math.random()>0.5){
				if(ud_flag){
					controller.keypress('down',1,1);
					R_state |= (1<<5);
				}
				else{
					controller.keypress('up',1,1);
					R_state |= (1<<6);
				}
			}
			if(Math.random()>0.5){
				if(lr_flag){
					controller.keypress('right',1,1);
					R_state |= (1<<4);
				}
				else{
					controller.keypress('left',1,1);
					R_state |= (1<<3);
				}
			}
			if(Math.random()>0.5){
				if(lr_flag){
					controller.keypress('left',1,1);
					R_state |= (1<<3);
				}
				else{
					controller.keypress('right',1,1);
					R_state |= (1<<4);
				}
			}
			if(Math.random()>0.5){
				controller.keypress('att');
				R_state |= (1<<2);
			}
		}
		else{
			var tmp = Math.random();
			if(tmp > 0.666){
				DuA();
				R_state |= 2;
			}
			else if(tmp > 0.333){
				DdA();
				R_state |= 1;
			}
			else{
				DfA();
			}
		}

			
		}

//Q learning

		function check_Q_state()
		{
			var state = 0,tmp=0;
			if(x_dis <= 50)
				tmp = 0;
			else if(x_dis <= 150)
				tmp = 1;
			else if(x_dis <= 200)
				tmp = 2;
			else if(x_dis <= 220)
				tmp = 3;
			else if(x_dis <= 240)
				tmp = 4;
			else if(x_dis <= 260)
				tmp = 5;
			else
				tmp = 6;
			state = state|(tmp<<4);
			
			if(opponent.ps.y < 0)
				tmp = 1;
			state = state|(tmp<<3);

			if(z_dis <= 12)
				tmp = 0;
			else if(z_dis <=32)
				tmp = 1;
			else if(z_dis <=52)
				tmp = 2;
			else if(z_dis <= 57)
				tmp = 3;
			else if(z_dis <= 77)
				tmp = 4;
			else
				tmp = 5;
			state = state|tmp;

			if(self.health.mp < 25)
				tmp = 0;
			else if(self.health.mp < 40)
				tmp = 1;
			else if(self.health.mp < 225)
				tmp = 2;
			else
				tmp = 3;
			state = state|(tmp<<7);

			if(self.state === 2)//running
				tmp = 1;
			else if(self.ps.y < 0)//flying
				tmp = 2;
			else if(self.state === 15)//return move
				tmp = 3;
			else
				tmp = 0;
			state = state|(tmp<<9);

			if(opponent.state === 16)//injury2
				tmp = 1;
			state = state|(tmp<<11);
			return state;

		}


//Q learning
//attacks

		function attack()
		{
			if(z_distance_to_opponent() < 10)
			{
				if(self.state() === 2)
				{
					if(x_distance_to_opponent() < 130)
					{
						controller.keypress('att');
					}
				}
				else if(x_distance_to_opponent() < 60)
				{
					controller.keypress('att');
				}
		 	}
		}
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
		function BEapproach(x, z)//x->+ z-down+
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
		function BEflee(x,z)
		{
			//controller.keypress('jump');
			if(x_distance_to_opponent() < 100)
			{
				//console.log('flee1');
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
				//console.log('flee2','dis:',z_distance_to_opponent(),'  z',z,' my_z:',self.ps.z);
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
