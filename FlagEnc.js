/************************************************************************
* Object to Encrypt Strings into a series of "Flags"
* NOTE: This is NOT strong encryption. It is merely a fun cipher for
*       friends to send each other "secret messages".
*
* Flag Info & Images from: https://flagpedia.net/index
*
* Copyright: Cynic Placebo 2024
* License: BSD 3-Clause License
************************************************************************/

/**
 * Turns a String into a series of "Flags" as a silly encryption game
 */
class FlagEnc {

  // Static Variables
  static COUNTRY = {
	"af":"Afghanistan","ax":"Aland Islands","al":"Albania","dz":"Algeria","as":"American Samoa","ad":"Andorra","ao":"Angola","ai":"Anguilla","aq":"Antarctica","ag":"Antigua and Barbuda","ar":"Argentina","am":"Armenia","aw":"Aruba","au":"Australia","at":"Austria","az":"Azerbaijan",
	"bs":"Bahamas","bh":"Bahrain","bd":"Bangladesh","bb":"Barbados","by":"Belarus","be":"Belgium","bz":"Belize","bj":"Benin","bm":"Bermuda","bt":"Bhutan","bo":"Bolivia","ba":"Bosnia and Herzegovina","bw":"Botswana","br":"Brazil","io":"British Indian Ocean Territory","bn":"Brunei","bg":"Bulgaria","bf":"Burkina Faso","bi":"Burundi",
	"kh":"Cambodia","cm":"Cameroon","ca":"Canada","cv":"Cape Verde","bq":"Caribbean Netherlands","ky":"Cayman Islands","cf":"Central African Republic","td":"Chad","cl":"Chile","cn":"China","cx":"Christmas Island","cc":"Cocos Islands","co":"Colombia","km":"Comoros","ck":"Cook Islands","cr":"Costa Rica","ci":"Côte d'Ivoire","hr":"Croatia","cu":"Cuba","cw":"Curaçao","cy":"Cyprus","cz":"Czechia",
	"dk":"Denmark","dj":"Djibouti","dm":"Dominica","do":"Dominican Republic","cd":"DR Congo",
	"ec":"Ecuador","eg":"Egypt","sv":"El Salvador","gb-eng":"England","gq":"Equatorial Guinea","er":"Eritrea","ee":"Estonia","sz":"Eswatini","et":"Ethiopia",
	"fk":"Falkland Islands","fo":"Faroe Islands","fj":"Fiji","fi":"Finland","fr":"France","gf":"French Guiana","pf":"French Polynesia","tf":"French Southern and Antarctic Lands",
	"ga":"Gabon","gm":"Gambia","ge":"Georgia","de":"Germany","gh":"Ghana","gi":"Gibraltar","gr":"Greece","gl":"Greenland","gd":"Grenada","gp":"Guadeloupe","gu":"Guam","gt":"Guatemala","gg":"Guernsey","gn":"Guinea","gw":"Guinea-Bissau","gy":"Guyana",
	"ht":"Haiti","hn":"Honduras","hk":"Hong Kong","hu":"Hungary",
	"is":"Iceland","in":"India","id":"Indonesia","ir":"Iran","iq":"Iraq","ie":"Ireland","im":"Isle of Man","il":"Israel","it":"Italy",
	"jm":"Jamaica","jp":"Japan","je":"Jersey","jo":"Jordan",
	"kz":"Kazakhstan","ke":"Kenya","ki":"Kiribati",
	"xk":"Kosovo","kw":"Kuwait","kg":"Kyrgyzstan",
	"la":"Laos","lv":"Latvia","lb":"Lebanon","ls":"Lesotho","lr":"Liberia","ly":"Libya","li":"Liechtenstein","lt":"Lithuania","lu":"Luxembourg",
	"mo":"Macau","mg":"Madagascar","mw":"Malawi","my":"Malaysia","mv":"Maldives","ml":"Mali","mt":"Malta","mh":"Marshall Islands","mq":"Martinique","mr":"Mauritania","mu":"Mauritius","yt":"Mayotte","mx":"Mexico","fm":"Micronesia","md":"Moldova","mn":"Mongolia","me":"Montenegro","ms":"Montserrat","ma":"Morocco","mz":"Mozambique","mm":"Myanmar",
	"na":"Namibia","nr":"Nauru","np":"Nepal","nl":"Netherlands","nc":"New Caledonia","nz":"New Zealand","ni":"Nicaragua","ne":"Niger","ng":"Nigeria","nu":"Niue","nf":"Norfolk Island","mk":"North Macedonia","gb-nir":"Northern Ireland","mp":"Northern Mariana Islands","no":"Norway","kp":"North Korea",
	"om":"Oman",
	"pk":"Pakistan","pw":"Palau","ps":"Palestine","pa":"Panama","pg":"Papua New Guinea","py":"Paraguay","pe":"Peru","ph":"Philippines","pn":"Pitcairn Islands","pl":"Poland","pt":"Portugal","pr":"Puerto Rico",
	"qa":"Qatar",
	"re":"Réunion","ro":"Romania","ru":"Russia","rw":"Rwanda","cg":"Republic of the Congo",
	"bl":"Saint Barthélemy","sh":"Saint Helena, Ascension and Tristan da Cunha","kn":"Saint Kitts and Nevis","lc":"Saint Lucia","pm":"Saint Pierre and Miquelon","vc":"Saint Vincent and the Grenadines","ws":"Samoa","sm":"San Marino","st":"São Tomé and Príncipe","sa":"Saudi Arabia","gb-sct":"Scotland","sn":"Senegal","rs":"Serbia","sc":"Seychelles","sl":"Sierra Leone","sg":"Singapore","sx":"Sint Maarten","sk":"Slovakia","si":"Slovenia","sb":"Solomon Islands","so":"Somalia","za":"South Africa","gs":"South Georgia","ss":"South Sudan","es":"Spain","lk":"Sri Lanka","sd":"Sudan","sr":"Suriname","se":"Sweden","ch":"Switzerland","sy":"Syria","kr":"South Korea",
	"tw":"Taiwan","tj":"Tajikistan","tz":"Tanzania","th":"Thailand","tl":"Timor-Leste","tg":"Togo","tk":"Tokelau","to":"Tonga","tt":"Trinidad and Tobago","tn":"Tunisia","tr":"Turkey","tm":"Turkmenistan","tc":"Turks and Caicos Islands","tv":"Tuvalu",
	"ug":"Uganda","ua":"Ukraine","ae":"United Arab Emirates","gb":"United Kingdom","us":"United States","uy":"Uruguay","uz":"Uzbekistan",
	"vu":"Vanuatu","va":"Vatican City","ve":"Venezuela","vn":"Vietnam","vg":"Virgin Islands (UK)","vi":"Virgin Islands (US)",
	"gb-wls":"Wales","wf":"Wallis and Futuna","eh":"Western Sahara",
	"xe":"Xamba Empire", //FAKE COUNTRY (we needed an X)
	"ye":"Yemen","zm":"Zambia","zw":"Zimbabwe"
  };
  static DEBUG_STRING = 'CYNIC_TEST_ALL_FLAGS_INSTEAD_OF_ENCRYPTING'; //Let's you debug all flags
  static DIR = 'country/5x3/'; //Where the Flag SVGs are
  static EXT = '.svg'; //All Flags must SVGs


  // Member Variables
  flags = {}; //Maps abbreviation to Flag File
  letterKeys = {}; //e.g. {'a':['af','ax','al'], ...}


  /** Create an instance of FlagEnc */ 
  constructor() {
    for (let k in FlagEnc.COUNTRY) {
      let v = FlagEnc.COUNTRY[k];
	  let c1 = v.charAt(0).toLowerCase();
	  this.flags[k] = FlagEnc.DIR + k + FlagEnc.EXT;
	  if (!(c1 in this.letterKeys))
        this.letterKeys[c1] = [];
      this.letterKeys[c1].push(k);
	}
  }


  /**
  * Encrypts the message as a series of Flag SVGs
  * The populates them in the DOM
  * @param s: String to turn into a Flag Cipher
  * @param e: HTML DOM Element to place SVGs in
  */
  populateFlags(s, e) {
    let keys = this.stringEncrypt(s);
    FlagEnc.domEmpty(e); //Clear it out so we can populate it

    for (let k of keys) {
	  let img = null;
      if (k.length == 1) { // Space or Newline
	    if ('~' == k) {
	      img = document.createElement('DIV');
          img.classList.add('newline');
		  img.style.display = "block";
		} else {
	      img = document.createElement('span');
          img.classList.add('space');
		  img.innerHTML = "&nbsp;";
		  img.style.display = "inline-block";
		  img.style.width = "60px";
        }
	  } else { // <img> creation for an SVG
//TODO: embed the SVG instead???
        img = document.createElement('img');
		img.src = this.flags[k];
		img.title = FlagEnc.COUNTRY[k];
		img.style.height = "120px";
		img.style.width = "200px";
	  }
      e.appendChild(img);
    }
  }


  /**
  * Returns an array of keys which IN ORDER can make the Flag Cipher
  * @param s: String to turn into a Flag Cipher
  */
  stringEncrypt(s) {
    if (FlagEnc.DEBUG_STRING == s) //Output *ALL* flags
      return Object.keys(FlagEnc.COUNTRY);
	s = s.toLowerCase();
	s = s.replace('~', ''); //Remove ~, because I'm gonna use it for my Newline
	s = s.replace(/(?:\r\n|\r|\n)/g, '~');
	let len = s.length;
	s = s.replace(/[^a-z ~]/g, ''); //Delete all characters we can't handle
	if (len != s.length)
	  alert("Couldn't encrypt invalid characters. Skipped everything other than A-Z, Spaces, & Newlines");
//TODO: do as a banner, rather than an alert?
    let keys = []; //Keys in order
    for (let i=0; i < s.length; ++i) {
      let c = s.charAt(i);
	  if (c in this.letterKeys) {
        let k = FlagEnc.randA(this.letterKeys[c]);
        keys.push(k);
      } else {
        keys.push(c); //Keep spaces and "~" for newlines
      }
	}
    return keys;
  }



  /************ Static Functions ************/
  /**
   * Clears all childNodes from a specified ID
   * @param e: the HTML DOM Element to purge
   */
  static domEmpty(e) {
    if (null == e)
      return; //No such element to purge
    while (e.firstChild)
      e.removeChild(e.lastChild);
  }


  /**
   * Returns a random item from an array
   * @param a: the array to fetch 1 random entry from
   */
  static randA(a) {
    let max = a.length - 1;
    return a[Math.floor(Math.random() * max)];
  }
}
