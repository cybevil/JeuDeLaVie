
// Création de la grille
function creerGrille() {

	// Variable Global
	NOMBRE_LIGNE = parseInt(document.getElementById("nbLigne").value);
	NOMBRE_COLONNE = parseInt(document.getElementById("nbColonne").value);
	continueSimu = true;
	INTERVAL = 180;
	grilleMasquer = false;
	NB_TOUR = 0;
	lancer = false;

	// Taille des cases
	const SIZE_BOX = "20px";

	// Racourci
	let RCboxesApp = document.getElementById("boxesApp");

	// Si Colonne ou ligne négatif alors quitter
	if(NOMBRE_LIGNE < 0 || NOMBRE_COLONNE < 0)
		return;

	// Remettre grille à 0 si taille changée
	RCboxesApp.innerHTML="";

	// Effacer Menu de la grille après validation
	document.getElementById("menuGrille").innerHTML="";

	// Masquer Input
	document.getElementById("menuJeu").style.display="block";
	
	// Création des cases de la grilles
	for (let i = 1; i <= NOMBRE_LIGNE; i++) {

		let ligneBox = document.createElement("tr");

		for (let j = 1; j <= NOMBRE_COLONNE; j++) {

			let box = document.createElement("td");

			box.classList.add("boxesL"+i);
			box.classList.add("whiteBG");
			box.classList.add("whiteBorder");
			box.style.width = SIZE_BOX;
			box.style.height = SIZE_BOX;
			box.setAttribute("onclick", "clickSurCase(\""+ ("boxesL"+i) +"\", "+j+")");

			ligneBox.appendChild(box);
		}
		RCboxesApp.appendChild(ligneBox);
	}

	// Création d'un tableau
	tmpCase = new Array(NOMBRE_LIGNE);
	for(i=1;i<=NOMBRE_LIGNE;i++)
		tmpCase[i] = new Array(NOMBRE_COLONNE);

	// Association de chaque cases avec un indice du tableau (ligne/caseLigne)
	for (let i = 1; i <= NOMBRE_LIGNE; i++)
		for (let j = 1; j <= NOMBRE_COLONNE; j++)		
			tmpCase[i][j] = document.getElementsByClassName("boxesL"+i)[j-1];
}

// Inversion mort/naissance au clic sur la case
function clickSurCase(elt, j) {
	let tmp = document.getElementsByClassName(elt);
	
	if(tmp[j-1].classList.contains("whiteBG")) {
		tmp[j-1].classList.remove("whiteBG");
		tmp[j-1].classList.remove("whiteBorder");
		tmp[j-1].classList.add("blackBG");
		tmp[j-1].classList.add("blackBorder");
	}

	else if(tmp[j-1].classList.contains("blackBG")) {
		tmp[j-1].classList.remove("blackBG");
		tmp[j-1].classList.remove("blackBorder");
		tmp[j-1].classList.add("whiteBG");
		tmp[j-1].classList.add("whiteBorder");
	}
}

// Lance la simulation
function lancerSimu() {

	// Nouveau tour
	NB_TOUR++;
	document.getElementById("nbTour").innerHTML = NB_TOUR;

	// Calcule du nombre de voisine pour chaque cases 
	let nbVoisine=0;

	for (var i = 1; i <= NOMBRE_LIGNE; i++) {

		for (let j = 1; j <= NOMBRE_COLONNE; j++) {

			nbVoisine=0;
			
			//Voisine de gauche
			if(j!=1 && tmpCase[i][j-1].classList.contains("blackBG")) nbVoisine++;

			//Voisine de droite
			if(j!=NOMBRE_COLONNE && tmpCase[i][j+1].classList.contains("blackBG")) nbVoisine++;

			//Voisine du haut
			if(i!=1 && tmpCase[i-1][j].classList.contains("blackBG")) nbVoisine++;

			//Voisine du bas
			if(i!=NOMBRE_LIGNE && tmpCase[i+1][j].classList.contains("blackBG")) nbVoisine++;

			//Voisine du haut-gauche
			if(j!=1 && i!=1 && tmpCase[i-1][j-1].classList.contains("blackBG")) nbVoisine++;

			//Voisine du haut-droite
			if(i!=1 && j!=NOMBRE_COLONNE && tmpCase[i-1][j+1].classList.contains("blackBG")) nbVoisine++;

			//Voisine du bas-gauche
			if(j!=1 && i!=NOMBRE_LIGNE && tmpCase[i+1][j-1].classList.contains("blackBG")) nbVoisine++;

			//Voisine du bas-droite
			if(i!=NOMBRE_LIGNE && j!=NOMBRE_COLONNE && tmpCase[i+1][j+1].classList.contains("blackBG")) nbVoisine++;

			// Règles du jeu && attribution mort/naissance

			// Ajouter class mort
			if(tmpCase[i][j].classList.contains("blackBG") && nbVoisine != 2 && nbVoisine != 3) tmpCase[i][j].classList.add("mort");

			// Ajouter class naissance
			if(tmpCase[i][j].classList.contains("whiteBG") && nbVoisine == 3) tmpCase[i][j].classList.add("naissance");
				
		}
	}

	// Actualisation de la grille
	for (var i = 1; i <= NOMBRE_LIGNE; i++) {

		for (let j = 1; j <= NOMBRE_COLONNE; j++) {

			if(tmpCase[i][j].classList.contains("mort")) {

				tmpCase[i][j].classList.replace("blackBG", "whiteBG");
				tmpCase[i][j].classList.replace("blackBorder", "whiteBorder");
				tmpCase[i][j].classList.remove("mort");
			}
			
			if(tmpCase[i][j].classList.contains("naissance")) {

				tmpCase[i][j].classList.replace("whiteBG", "blackBG");
				tmpCase[i][j].classList.replace("whiteBorder", "blackBorder");
				tmpCase[i][j].classList.remove("naissance");
			}
		}
	}	
}

// Lance la simulation automatique
function autoSimu() {
	lancer = true;

	if(continueSimu) {

		simu = setInterval("lancerSimu()", INTERVAL);
		document.getElementById("autoOn").innerHTML = "ON";
		document.getElementById("autoOn").style.color = "green";
		continueSimu = false;

	}
	else{

		clearInterval( simu );
		document.getElementById("autoOn").innerHTML = "OFF";
		document.getElementById("autoOn").style.color = "red";
		continueSimu = true;
	}
}

// Tue toutes les cellules
function clearGrille() {
	NB_TOUR = 0;
	document.getElementById("nbTour").innerHTML = NB_TOUR;
	for (var i = 1; i <= NOMBRE_LIGNE; i++) {

		for (let j = 1; j <= NOMBRE_COLONNE; j++) {

			if(tmpCase[i][j].classList.contains("mort")) {				
				tmpCase[i][j].classList.remove("mort");
			}
			
			else if(tmpCase[i][j].classList.contains("naissance")) {
				tmpCase[i][j].classList.remove("naissance");
			}

			if(tmpCase[i][j].classList.contains("blackBG")) {				
				tmpCase[i][j].classList.replace("blackBG", "whiteBG");
				tmpCase[i][j].classList.replace("blackBorder", "whiteBorder");
			}	
		}
	}
	continueSimu = false;
	autoSimu();
}

// Masque la grille
function masquerGrille() {

	if(grilleMasquer) {

		for (var i = 1; i <= NOMBRE_LIGNE; i++) {

			for (let j = 1; j <= NOMBRE_COLONNE; j++) {		

					if(tmpCase[i][j].classList.contains("whiteBG")) {
						tmpCase[i][j].classList.add("whiteBorder");
					}
					else if(tmpCase[i][j].classList.contains("blackBG")) {
						tmpCase[i][j].classList.add("blackBorder");
					}
					grilleMasquer = false;
			}
		}
	}
	else {

		for (var i = 1; i <= NOMBRE_LIGNE; i++) {

			for (let j = 1; j <= NOMBRE_COLONNE; j++) {		

					if(tmpCase[i][j].classList.contains("whiteBG")) {
						tmpCase[i][j].classList.remove("whiteBorder");
					}
					else if(tmpCase[i][j].classList.contains("blackBG")) {
						tmpCase[i][j].classList.remove("blackBorder");
					}
					grilleMasquer = true;
			}
		}
	}
}

// Augmente la vitesse auto
function vitessePlus() {
	if(!lancer)
		return;

	continueSimu = false;
	autoSimu();
	INTERVAL -= 10;
	document.getElementById("idVitesse").innerHTML = (-INTERVAL/10)+18;
}

// Diminue la vitesse auto
function vitesseMoins() {
	if(!lancer)
		return;

	continueSimu = false;
	autoSimu();
	INTERVAL += 10;
	document.getElementById("idVitesse").innerHTML = (-INTERVAL/10)+18;
}

// Exemples d'essemble de cellules complexes
function exCanon() {
	tmpCase[5][1].classList.replace("whiteBG", "blackBG");
	tmpCase[5][2].classList.replace("whiteBG", "blackBG");
	tmpCase[6][1].classList.replace("whiteBG", "blackBG");
	tmpCase[6][2].classList.replace("whiteBG", "blackBG");
	tmpCase[5][11].classList.replace("whiteBG", "blackBG");
	tmpCase[6][11].classList.replace("whiteBG", "blackBG");
	tmpCase[7][11].classList.replace("whiteBG", "blackBG");
	tmpCase[4][12].classList.replace("whiteBG", "blackBG");
	tmpCase[3][13].classList.replace("whiteBG", "blackBG");
	tmpCase[3][14].classList.replace("whiteBG", "blackBG");
	tmpCase[8][12].classList.replace("whiteBG", "blackBG");
	tmpCase[9][13].classList.replace("whiteBG", "blackBG");
	tmpCase[9][14].classList.replace("whiteBG", "blackBG");
	tmpCase[6][15].classList.replace("whiteBG", "blackBG");
	tmpCase[4][16].classList.replace("whiteBG", "blackBG");
	tmpCase[8][16].classList.replace("whiteBG", "blackBG");
	tmpCase[5][17].classList.replace("whiteBG", "blackBG");
	tmpCase[6][17].classList.replace("whiteBG", "blackBG");
	tmpCase[7][17].classList.replace("whiteBG", "blackBG");
	tmpCase[6][18].classList.replace("whiteBG", "blackBG");
	tmpCase[3][21].classList.replace("whiteBG", "blackBG");
	tmpCase[4][21].classList.replace("whiteBG", "blackBG");
	tmpCase[5][21].classList.replace("whiteBG", "blackBG");
	tmpCase[3][22].classList.replace("whiteBG", "blackBG");
	tmpCase[4][22].classList.replace("whiteBG", "blackBG");
	tmpCase[5][22].classList.replace("whiteBG", "blackBG");
	tmpCase[2][23].classList.replace("whiteBG", "blackBG");
	tmpCase[6][23].classList.replace("whiteBG", "blackBG");
	tmpCase[1][25].classList.replace("whiteBG", "blackBG");
	tmpCase[2][25].classList.replace("whiteBG", "blackBG");
	tmpCase[6][25].classList.replace("whiteBG", "blackBG");
	tmpCase[7][25].classList.replace("whiteBG", "blackBG");
	tmpCase[3][35].classList.replace("whiteBG", "blackBG");
	tmpCase[4][35].classList.replace("whiteBG", "blackBG");
	tmpCase[3][36].classList.replace("whiteBG", "blackBG");
	tmpCase[4][36].classList.replace("whiteBG", "blackBG");

	tmpCase[5][1].classList.replace("whiteBorder", "blackBorder");
	tmpCase[5][2].classList.replace("whiteBorder", "blackBorder");
	tmpCase[6][1].classList.replace("whiteBorder", "blackBorder");
	tmpCase[6][2].classList.replace("whiteBorder", "blackBorder");
	tmpCase[5][11].classList.replace("whiteBorder", "blackBorder");
	tmpCase[6][11].classList.replace("whiteBorder", "blackBorder");
	tmpCase[7][11].classList.replace("whiteBorder", "blackBorder");
	tmpCase[4][12].classList.replace("whiteBorder", "blackBorder");
	tmpCase[3][13].classList.replace("whiteBorder", "blackBorder");
	tmpCase[3][14].classList.replace("whiteBorder", "blackBorder");
	tmpCase[8][12].classList.replace("whiteBorder", "blackBorder");
	tmpCase[9][13].classList.replace("whiteBorder", "blackBorder");
	tmpCase[9][14].classList.replace("whiteBorder", "blackBorder");
	tmpCase[6][15].classList.replace("whiteBorder", "blackBorder");
	tmpCase[4][16].classList.replace("whiteBorder", "blackBorder");
	tmpCase[8][16].classList.replace("whiteBorder", "blackBorder");
	tmpCase[5][17].classList.replace("whiteBorder", "blackBorder");
	tmpCase[6][17].classList.replace("whiteBorder", "blackBorder");
	tmpCase[7][17].classList.replace("whiteBorder", "blackBorder");
	tmpCase[6][18].classList.replace("whiteBorder", "blackBorder");
	tmpCase[3][21].classList.replace("whiteBorder", "blackBorder");
	tmpCase[4][21].classList.replace("whiteBorder", "blackBorder");
	tmpCase[5][21].classList.replace("whiteBorder", "blackBorder");
	tmpCase[3][22].classList.replace("whiteBorder", "blackBorder");
	tmpCase[4][22].classList.replace("whiteBorder", "blackBorder");
	tmpCase[5][22].classList.replace("whiteBorder", "blackBorder");
	tmpCase[2][23].classList.replace("whiteBorder", "blackBorder");
	tmpCase[6][23].classList.replace("whiteBorder", "blackBorder");
	tmpCase[1][25].classList.replace("whiteBorder", "blackBorder");
	tmpCase[2][25].classList.replace("whiteBorder", "blackBorder");
	tmpCase[6][25].classList.replace("whiteBorder", "blackBorder");
	tmpCase[7][25].classList.replace("whiteBorder", "blackBorder");
	tmpCase[3][35].classList.replace("whiteBorder", "blackBorder");
	tmpCase[4][35].classList.replace("whiteBorder", "blackBorder");
	tmpCase[3][36].classList.replace("whiteBorder", "blackBorder");
	tmpCase[4][36].classList.replace("whiteBorder", "blackBorder");
}

function exClignotant() {	
	tmpCase[2][1].classList.replace("whiteBG", "blackBG");
	tmpCase[2][2].classList.replace("whiteBG", "blackBG");
	tmpCase[2][3].classList.replace("whiteBG", "blackBG");

	tmpCase[2][1].classList.replace("whiteBorder", "blackBorder");
	tmpCase[2][2].classList.replace("whiteBorder", "blackBorder");
	tmpCase[2][3].classList.replace("whiteBorder", "blackBorder");
}

function exPlaneur() {	
	tmpCase[2][1].classList.replace("whiteBG", "blackBG");
	tmpCase[3][2].classList.replace("whiteBG", "blackBG");
	tmpCase[1][3].classList.replace("whiteBG", "blackBG");
	tmpCase[2][3].classList.replace("whiteBG", "blackBG");
	tmpCase[3][3].classList.replace("whiteBG", "blackBG");

	tmpCase[2][1].classList.replace("whiteBorder", "blackBorder");
	tmpCase[3][2].classList.replace("whiteBorder", "blackBorder");
	tmpCase[1][3].classList.replace("whiteBorder", "blackBorder");
	tmpCase[2][3].classList.replace("whiteBorder", "blackBorder");
	tmpCase[3][3].classList.replace("whiteBorder", "blackBorder");
}

function exRuche() {	
	tmpCase[2][1].classList.replace("whiteBG", "blackBG");
	tmpCase[2][2].classList.replace("whiteBG", "blackBG");
	tmpCase[2][3].classList.replace("whiteBG", "blackBG");
	tmpCase[2][4].classList.replace("whiteBG", "blackBG");

	tmpCase[2][1].classList.replace("whiteBorder", "blackBorder");
	tmpCase[2][2].classList.replace("whiteBorder", "blackBorder");
	tmpCase[2][3].classList.replace("whiteBorder", "blackBorder");
	tmpCase[2][4].classList.replace("whiteBorder", "blackBorder");
}

function ex4Ruche() {
	tmpCase[8][5].classList.replace("whiteBG", "blackBG");
	tmpCase[7][6].classList.replace("whiteBG", "blackBG");
	tmpCase[7][7].classList.replace("whiteBG", "blackBG");
	tmpCase[7][8].classList.replace("whiteBG", "blackBG");
	tmpCase[8][8].classList.replace("whiteBG", "blackBG");
	tmpCase[9][6].classList.replace("whiteBG", "blackBG");
	tmpCase[9][7].classList.replace("whiteBG", "blackBG");

	tmpCase[8][5].classList.replace("whiteBorder", "blackBorder");
	tmpCase[7][6].classList.replace("whiteBorder", "blackBorder");
	tmpCase[7][7].classList.replace("whiteBorder", "blackBorder");
	tmpCase[7][8].classList.replace("whiteBorder", "blackBorder");
	tmpCase[8][8].classList.replace("whiteBorder", "blackBorder");
	tmpCase[9][6].classList.replace("whiteBorder", "blackBorder");
	tmpCase[9][7].classList.replace("whiteBorder", "blackBorder");
}

function ex4Clignotant() {	
	tmpCase[5][3].classList.replace("whiteBG", "blackBG");
	tmpCase[5][4].classList.replace("whiteBG", "blackBG");
	tmpCase[5][5].classList.replace("whiteBG", "blackBG");
	tmpCase[5][6].classList.replace("whiteBG", "blackBG");
	tmpCase[5][7].classList.replace("whiteBG", "blackBG");

	tmpCase[5][3].classList.replace("whiteBorder", "blackBorder");
	tmpCase[5][4].classList.replace("whiteBorder", "blackBorder");
	tmpCase[5][5].classList.replace("whiteBorder", "blackBorder");
	tmpCase[5][6].classList.replace("whiteBorder", "blackBorder");
	tmpCase[5][7].classList.replace("whiteBorder", "blackBorder");
}

function exOieCanada() {
	tmpCase[14][1].classList.replace("whiteBG", "blackBG");
	tmpCase[13][2].classList.replace("whiteBG", "blackBG");
	tmpCase[13][3].classList.replace("whiteBG", "blackBG");
	tmpCase[14][3].classList.replace("whiteBG", "blackBG");
	tmpCase[14][4].classList.replace("whiteBG", "blackBG");
	tmpCase[14][5].classList.replace("whiteBG", "blackBG");
	tmpCase[15][5].classList.replace("whiteBG", "blackBG");
	tmpCase[15][6].classList.replace("whiteBG", "blackBG");
	tmpCase[17][5].classList.replace("whiteBG", "blackBG");
	tmpCase[18][4].classList.replace("whiteBG", "blackBG");
	tmpCase[20][2].classList.replace("whiteBG", "blackBG");
	tmpCase[20][3].classList.replace("whiteBG", "blackBG");
	tmpCase[19][5].classList.replace("whiteBG", "blackBG");
	tmpCase[19][6].classList.replace("whiteBG", "blackBG");
	tmpCase[20][5].classList.replace("whiteBG", "blackBG");
	tmpCase[21][5].classList.replace("whiteBG", "blackBG");
	tmpCase[21][6].classList.replace("whiteBG", "blackBG");
	tmpCase[15][9].classList.replace("whiteBG", "blackBG");
	tmpCase[15][10].classList.replace("whiteBG", "blackBG");
	tmpCase[16][9].classList.replace("whiteBG", "blackBG");
	tmpCase[18][8].classList.replace("whiteBG", "blackBG");
	tmpCase[18][9].classList.replace("whiteBG", "blackBG");
	tmpCase[19][8].classList.replace("whiteBG", "blackBG");
	tmpCase[20][8].classList.replace("whiteBG", "blackBG");
	tmpCase[19][10].classList.replace("whiteBG", "blackBG");
	tmpCase[20][10].classList.replace("whiteBG", "blackBG");
	tmpCase[21][11].classList.replace("whiteBG", "blackBG");
	tmpCase[22][11].classList.replace("whiteBG", "blackBG");
	tmpCase[23][11].classList.replace("whiteBG", "blackBG");
	tmpCase[22][10].classList.replace("whiteBG", "blackBG");
	tmpCase[23][10].classList.replace("whiteBG", "blackBG");
	tmpCase[14][12].classList.replace("whiteBG", "blackBG");
	tmpCase[13][13].classList.replace("whiteBG", "blackBG");
	tmpCase[12][13].classList.replace("whiteBG", "blackBG");
	tmpCase[12][12].classList.replace("whiteBG", "blackBG");
	tmpCase[12][11].classList.replace("whiteBG", "blackBG");

	tmpCase[14][1].classList.replace("whiteBorder", "blackBorder");
	tmpCase[13][2].classList.replace("whiteBorder", "blackBorder");
	tmpCase[13][3].classList.replace("whiteBorder", "blackBorder");
	tmpCase[14][3].classList.replace("whiteBorder", "blackBorder");
	tmpCase[14][4].classList.replace("whiteBorder", "blackBorder");
	tmpCase[14][5].classList.replace("whiteBorder", "blackBorder");
	tmpCase[15][5].classList.replace("whiteBorder", "blackBorder");
	tmpCase[15][6].classList.replace("whiteBorder", "blackBorder");
	tmpCase[17][5].classList.replace("whiteBorder", "blackBorder");
	tmpCase[18][4].classList.replace("whiteBorder", "blackBorder");
	tmpCase[20][2].classList.replace("whiteBorder", "blackBorder");
	tmpCase[20][3].classList.replace("whiteBorder", "blackBorder");
	tmpCase[19][5].classList.replace("whiteBorder", "blackBorder");
	tmpCase[19][6].classList.replace("whiteBorder", "blackBorder");
	tmpCase[20][5].classList.replace("whiteBorder", "blackBorder");
	tmpCase[21][5].classList.replace("whiteBorder", "blackBorder");
	tmpCase[21][6].classList.replace("whiteBorder", "blackBorder");
	tmpCase[15][9].classList.replace("whiteBorder", "blackBorder");
	tmpCase[15][10].classList.replace("whiteBorder", "blackBorder");
	tmpCase[16][9].classList.replace("whiteBorder", "blackBorder");
	tmpCase[18][8].classList.replace("whiteBorder", "blackBorder");
	tmpCase[18][9].classList.replace("whiteBorder", "blackBorder");
	tmpCase[19][8].classList.replace("whiteBorder", "blackBorder");
	tmpCase[20][8].classList.replace("whiteBorder", "blackBorder");
	tmpCase[19][10].classList.replace("whiteBorder", "blackBorder");
	tmpCase[20][10].classList.replace("whiteBorder", "blackBorder");
	tmpCase[21][11].classList.replace("whiteBorder", "blackBorder");
	tmpCase[22][11].classList.replace("whiteBorder", "blackBorder");
	tmpCase[23][11].classList.replace("whiteBorder", "blackBorder");
	tmpCase[22][10].classList.replace("whiteBorder", "blackBorder");
	tmpCase[23][10].classList.replace("whiteBorder", "blackBorder");
	tmpCase[14][12].classList.replace("whiteBorder", "blackBorder");
	tmpCase[13][13].classList.replace("whiteBorder", "blackBorder");
	tmpCase[12][13].classList.replace("whiteBorder", "blackBorder");
	tmpCase[12][12].classList.replace("whiteBorder", "blackBorder");
	tmpCase[12][11].classList.replace("whiteBorder", "blackBorder");
}