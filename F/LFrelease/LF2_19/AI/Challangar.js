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
		Q = [], R = [];
		var q_ms1=1<<7,q_ms2=2<<7,q_ms3=3<<7,
				q_x1=1<<4,q_x2=2<<4,q_x3=3<<4,q_x4=4<<4,q_x5=5<<4,q_x6=6<<4,q_y1=1<<3;
				q_z1=1,q_z2=2,q_z3=3,q_z4=4,q_z5=5;
		var x_dis=0,z_dis=0,Q_state=0, R_state=0,Q_stateP=0,R_stateP=0;
		var flag = false,up_flag=false,left_flag=false,stop=false;
		for(var x = 0; x<1025; x++){
			Q[x] = [];
			R[x] = [];
			for(y = 0; y<129; ++y){
				if(!(x&(3<<4)) && !(x&7) && y&(1<<2) && !(y&2) && y&1){//att
					R[x][y] = 20;
//					Q[x][y] = 20;
				}
				else if( x&(1<<7) && x&(1<<4) && !(x&7) && y&1){//running att
					R[x][y] = 55;//95
//					Q[x][y] = 95;
				}
				else if( x&(1<<7) && x&(1<<4)  && x&(2<<4) && !(x&7) && y&(1<<5) &&y&1 ){//running jump att
					R[x][y] = 80;
//					Q[x][y] = 80;
				}
//				else if( x|(3<<7)===x && x|(3<<4)===x && x&(2<<1) && y&(1<<5) && y&(1<<2) && y&(1<<4) && y&1 ){
					//return then jump up(down) left(right) att
//					R[x][y] = 80;
//					Q[x][y] = 80;
//				}
				// return then jump left(right) att
//				else if(x|(3<<7)===x && x|(3<<4)===x && !(x&7) && y&(1<<5) && y&(1<<2) && y&1 ){
//					R[x][y] = 80;
//					Q[x][y] = 80;
//				}
				//jump  left(right) att
				else if(  x&(1<<4) && x&(4<<4)  && y&(1<<5) && (y&(1<<4) || y&(1<<2)) && y&1 ){
					R[x][y] = 60;
//					Q[x][y] = 60;
				}
				//jump up(down) left(right) att
				else if( x&(1<<4) && x&(4<<4) && x&4  && y&(1<<5) && (y&(1<<4)) && y&4 && y&1){
					R[x][y] = 60;
//					Q[x][y] = 60;
				}
				//encourage approaching
				else if( /*(y&(1<<4) && !(y&(1<<3))) ||*/ (y&(1<<2) && !(y&(1<<1))) ){
					R[x][y] = 1;				
				}
				//encourage approaching
				else if( !(x&7) && (y&(1<<4) && !(y&(1<<3))) && !(y&2))
					R[x][y] = 1;
				else{
					R[x][y]=0;
				}

				R[x][y] = 0;
				Q[x][y] = 0;
			}
		}
		console.log('Q inited.......................');



//		console.log(contents);
		

		function id() 
		{
			
			if(stop)
				return;

			if(self.state()===16 || self.state()===12 || self.state()===14 )
			{
				return;
			}


			var R_value=0;
			reset_keys();
			Q_stateP=Q_state;
			Q_state=0;
			flag = false;left_flag=false;up_flag=false;
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
			Q_state = check_Q_state();//get the current Q state 

			//		console.log('Print:',R_value);
			//		console.log('??:',R[Q_stateP][R_stateP]);
			if((R[Q_stateP][R_state]===0 && abs(R_value) > 1 ) || abs(R_value+1) > abs(R[Q_stateP][R_stateP]+1)){
				R[Q_stateP][R_stateP] = R_value;
			}

//			if(R[Q_stateP][R_stateP] !==0){
//				console.log('oh:',oc_hp,' oh_l:',op_hp,' mh:',mc_hp,' mh_l:',mp_hp,' Q:',Q_stateP,' R:',R_stateP);
//				console.log('R[]',R[Q_stateP][R_stateP]);
//			}
			Q[Q_stateP][R_stateP] = R[Q_stateP][R_stateP] + 0.8*max_q(Q_state);
			console.log('Q state value:',Q[Q_stateP][R_stateP],' Q state:',Q_stateP,'R state',R_stateP,'state',
					self.state(),' R value:',R[Q_stateP][R_stateP]);

			if(oc_hp <= 0 || mc_hp <= 0 ){
				stop = true;
				var output = "",output2 = "";
				for(var i=0;i<1025;++i){
					for(var j=0;j<129;++j){
//						output += R[i][j].toString()+" ";
						output2 += Q[i][j].toString()+" ";
					}
				}
//				console.log(output);
				console.log(output2);
				return;
			}

			//		console.log('x:',x_distance_to_opponent(),' z:',z_distance_to_opponent());
			x_dis = x_distance_to_opponent();
			z_dis = z_distance_to_opponent();
			if(self.ps.x > opponent.ps.x)
				left_flag = true;
			if(self.ps.z > opponent.ps.z)
				up_flag = true;
//			console.log('left',left_flag,'up',up_flag);

			if(opponent.state() === 14 || opponent.AI.blink()){
				BEflee(opponent.ps.x,opponent.ps.z);
				return;
			}	

			if(Q_state&(3<<7) && special_move())//check if ai should do special move
				return;

			if(opponent.state() === 10){//he is being caught
				controller.keypress('att');
				return;
			}
	
			if(opponent.state() === 16 && x_dis < 10 && z_dis < 12){
				if(left_flag)
					controller.keypress('left',1,1);
				else
					controller.keypress('right',1,1);
				controller.keypress('up',1,1);
				controller.keypress('down',1,1);
				return;
			}

			if(x_dis > 300)
			{
				approach(opponent.ps.x,opponent.ps.z);
				return;
			}

	
			haha = max_q(Q_state);
			if( (haha!==0 && Math.random() < haha/(haha+5))){
				R_state = bestmove();
				if(R_state !==0){
					do_move(R_state);
					return;
				}
			}
			//		console.log(Q_state);
			//		console.log('sx:',self.ps.x,' sz:',self.ps.z,' ox:',opponent.ps.x,' oz:',opponent.ps.z);
			R_state = 0;
			if(Math.random()>0.5){
				controller.keypress('jump');
				R_state |= (1<<5);
			}
			if(Math.random()>0.5){
				if(up_flag){
					controller.keypress('up',1,1);
					R_state |= (1<<4);
				}
				else{
					controller.keypress('down',1,1);
					R_state |= (1<<3);
				}
			}
			if(Math.random()>0.5){
				if(up_flag){
					controller.keypress('down',1,1);
					R_state |= (1<<3);
				}
				else{
					controller.keypress('up',1,1);
					R_state |= (1<<4);
				}
			}
			if(Math.random()>0.5){
				if(left_flag){
					controller.keypress('right',1,1);
					R_state |= (1<<2);
				}
				else{
					controller.keypress('left',1,1);
					R_state |= (1<<1);
				}
			}
			if(Math.random()>0.5){
				if(left_flag){
					controller.keypress('left',1,1);
					R_state |= (1<<1);
				}
				else{
					controller.keypress('right',1,1);
					R_state |= (1<<2);
				}
			}
			if(Math.random()>0.5){
				controller.keypress('att');
				R_state |= 1;
			}


		}

		//Q learning

		function check_Q_state()
		{
			var state = 0,tmp=0;
			if(x_dis <= 65)
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
			tmp=0	
			if(opponent.ps.y < 0)
				tmp = 1;
			state = state|(tmp<<3);
			tmp=0;
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
			tmp=0;
			if(self.state === 2)//running
				tmp = 1;
			else if(self.ps.y < 0)//flying
				tmp = 2;
			else if(self.health.mp > 225)//return move
				tmp = 3;
			else
				tmp = 0;
			state = state|(tmp<<7);
			tmp=0;
			return state;
		}

		function max_q(Q_state)
		{
			var max=-1;
			for(var x = 0; x<129; ++x){
				if(Q[Q_state][x] > max)
					max = Q[Q_state][x];
			}
			return max;
		}

		function bestmove()
		{
			var best = 0,tmp=-1;
			for(var x=0; x<129; ++x){
				if(Q[Q_state][x] > tmp){
					tmp = Q[Q_state][x];
					best = x;
				}
			}
			return best;
		}

		function do_move(state)
		{
			if(state&(1<<5)){
				controller.keypress('jump');
			}
			if(state&(1<<4)){
				if(up_flag)
					controller.keypress('up',1,1);
				else
					controller.keypress('down',1,1);
			}
			if(state&(1<<3)){
				if(up_flag)
					controller.keypress('down',1,1);
				else
					controller.keypress('up',1,1);
			}			
			if(state&(1<<2)){
				if(left_flag)
					controller.keypress('left',1,1);
				else
					controller.keypress('right',1,1);
			}
			if(state&(1<<1)){
				if(left_flag)
					controller.keypress('right',1,1);
				else
					controller.keypress('left',1,1);
			}
			if(state&1)
				controller.keypress('att');
		}


//Q learning
//attacks
//
		function special_move()
		{//TODO
			if(self.ps.y < 0)
				return false;
			if(x_dis < 55 && z_dis < 12  && self.health.mp > 225){
				DuA();
				return true;}
			else if(x_dis < 70 && z_dis < 12  && self.health.mp > 40){
				DdA();
				return true;}

			return false;
		}

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
			if(x_distance_to_opponent() < 260)
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
			else if(z_distance_to_opponent() < 30)
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
