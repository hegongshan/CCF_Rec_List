/* 
 * ------------------------------------------------------------
 * 
 * Begin:  The CCF Recommendation List
 *
 * ------------------------------------------------------------
 */

/* 
 * ------------------------------------------------------------
 * 
 * 计算机体系结构/并行与分布计算/存储系统
 *
 * (Computer Architecture/Parallel and Distributed Computing/Storage System)
 * 
 * ------------------------------------------------------------
 */

let ARCH_DCP_SS = {
    /*
     * Journal
     */
    // Rank A
    "journals/tocs": { "venue": "TOCS", "rank": "A" },
    "journals/tos": { "venue": "TOS", "rank": "A" },
    "journals/tcad": { "venue": "TCAD", "rank": "A" },
    "journals/tc": { "venue": "TC", "rank": "A" },
    "journals/tpds": { "venue": "TPDS", "rank": "A" },
    "journals/taco": { "venue": "TACO", "rank": "A" },
    
    // Rank B
    "journals/taas": { "venue": "TAAS", "rank": "B" },
    "journals/todaes": { "venue": "TODAES", "rank": "B" },
    "journals/tecs": { "venue": "TECS", "rank": "B" },
    "journals/trets": { "venue": "TRETS", "rank": "B" },
    "journals/tvlsi": { "venue": "TVLSI", "rank": "B" },
    "journals/jpdc": { "venue": "JPDC", "rank": "B" },
    "journals/jsa": { "venue": "JSA", "rank": "B" },
    "journals/parco": { "venue": "PARCO", "rank": "B" },
    // Performance Evaluation: An International Journal

    // Rank C
    "journals/jetc": { "venue": "JETC", "rank": "C" },
    "journals/concurrency": { "venue": "Concurrency and Computation: Practice and Experience", "rank": "C" },
    "journals/dc": { "venue": "DC", "rank": "C" },
    "journals/fgcs": { "venue": "FGCS", "rank": "C" },
    "journals/tcc": { "venue": "TCC", "rank": "C" },
    "journals/integration": { "venue": "Integration", "rank": "C" },
    // Journal of Electronic Testing-Theory and Applications
    "journals/grid": { "venue": "JGC", "rank": "C" },
    "journals/rts": { "venue": "RTS", "rank": "C" },
    "journals/tjs": { "venue": "TJSC", "rank": "C" },
    "journals/tcasI": { "venue": "TCASI", "rank": "C" },
    "journals/ccfthpc": { "venue": "CCF-THPC", "rank": "C" },
    "journals/tsusc": { "venue": "TSUSC", "rank": "C" },
    

    /*
     * Conference
     */
    // Rank A 
    "conf/ppopp": { "venue": "PPoPP", "rank": "A"},
    "conf/fast": { "venue": "FAST", "rank": "A" },
    "conf/dac": { "venue": "DAC", "rank": "A"},
    "conf/hpca": { "venue": "HPCA", "rank": "A" },
    "conf/micro": { "venue": "MICRO", "rank": "A" },
    "conf/sc": { "venue": "SC", "rank": "A" },
    "conf/asplos": { "venue": "ASPLOS", "rank": "A" },
    "conf/isca": { "venue": "ISCA", "rank": "A" },
    "conf/usenix": { "venue": "USENIX ATC", "rank": "A" },
    "conf/eurosys": { "venue": "EuroSys", "rank": "A" },

    // Rank B
    "conf/cloud": { "venue": "SoCC", "rank": "B"},
    "conf/spaa": { "venue": "SPAA", "rank": "B"},
    "conf/podc": { "venue": "PODC", "rank": "B"},
    "conf/fpga": { "venue": "FPGA", "rank": "B"},
    "conf/cgo": { "venue": "CGO", "rank": "B"},
    "conf/date": { "venue": "DATE", "rank": "B"},
    "conf/hotchips": { "venue": "Hot Chips", "rank": "B"},
    "conf/cluster": { "venue": "CLUSTER", "rank": "B"},
    "conf/iccd": { "venue": "ICCD", "rank": "B"},
    "conf/iccad": { "venue": "ICCAD", "rank": "B"},
    "conf/icdcs": { "venue": "ICDCS", "rank": "B"},
    "conf/codes": { "venue": "CODES+ISSS", "rank": "B"},
    "conf/hipeac": { "venue": "HiPEAC", "rank": "B"},

    "conf/sigmetrics": { "venue": "SIGMETRICS", "rank": "B"},
    "conf/IEEEpact": { "venue": "PACT", "rank": "B"},
    "conf/icpp": { "venue": "ICPP", "rank": "B"},
    "conf/ics": { "venue": "ICS", "rank": "B"},
    "conf/vee": { "venue": "VEE", "rank": "B"},
    "conf/ipps": { "venue": "IPDPS", "rank": "B"},
    "conf/performance": { "venue": "Performance", "rank": "B"},
    "conf/hpdc": { "venue": "HPDC", "rank": "B"},
    "conf/itc": { "venue": "ITC", "rank": "B"},
    "conf/lisa": { "venue": "LISA", "rank": "B"},
    "conf/mss": { "venue": "MSST", "rank": "B" },
    "conf/rtas": { "venue": "RTAS", "rank": "B"},
    "conf/europar": { "venue": "Euro-Par", "rank": "B"},

    // Rank C
    "conf/cf": { "venue": "CF", "rank": "C" },
    "conf/systor": { "venue": "SYSTOR", "rank": "C" },
    "conf/nocs": { "venue": "NOCS", "rank": "C" },
    "conf/asap": { "venue": "ASAP", "rank": "C" },
    "conf/aspdac": { "venue": "ASP-DAC", "rank": "C" },
    "conf/ets": { "venue": "ETS", "rank": "C" },
    "conf/fpl": { "venue": "FPL", "rank": "C" },
    "conf/fccm": { "venue": "FCCM", "rank": "C" },
    "conf/glvlsi": { "venue": "GLSVLSI", "rank": "C" },
    "conf/ats": { "venue": "ATS", "rank": "C" },
    "conf/hpcc": { "venue": "HPCC", "rank": "C" },
    "conf/hipc": { "venue": "HiPC", "rank": "C" },
    "conf/mascots": { "venue": "MASCOTS", "rank": "C" },

    "conf/ispa": { "venue": "ISPA", "rank": "C" },
    "conf/ccgrid": { "venue": "CCGRID", "rank": "C" },
    "conf/npc": { "venue": "NPC", "rank": "C" },
    "conf/ica3pp": { "venue": "ICA3PP", "rank": "C" },
    "conf/cases": { "venue": "CASES", "rank": "C" },
    "conf/fpt": { "venue": "FPT", "rank": "C" },
    "conf/icpads": { "venue": "ICPADS", "rank": "C" },
    "conf/iscas": { "venue": "ISCAS", "rank": "C" },
    "conf/islped": { "venue": "ISLPED", "rank": "C" },
    "conf/ispd": { "venue": "ISPD", "rank": "C" },
    "conf/hoti": { "venue": "HotI", "rank": "C" },
    "conf/vts": { "venue": "VTS", "rank": "C" },
    "conf/itc-asia": { "venue": "ITC-Asia", "rank": "C" },
};

/* 
 * ------------------------------------------------------------
 * 
 * 软件工程/系统软件/程序设计语言
 *
 * (Software Engineering/System Software/Programming Language)
 * 
 * ------------------------------------------------------------
 */
let SE_SS_PDL = {
    "conf/osdi": { "venue": "OSDI", "rank": "A" },
    "conf/sosp": { "venue": "SOSP", "rank": "A" },

    "conf/ispass": { "venue": "ISPASS", "rank": "C"},
};

/* 
 * ------------------------------------------------------------
 * 
 * 计算机网络
 *
 * (Computer Network)
 * ------------------------------------------------------------
 */
let CN = {
    /*
     * Journal
     */
    // Rank A
    "journal/jsac":{"venue": "JSAC", "rank": "A"},
    "journal/tmc":{"venue": "TMC", "rank": "A"},
    "journal/ton":{"venue": "TON", "rank": "A"},
                   
    // Rank B
    "journal/toit":{"venue": "TOIT", "rank": "B"},
    "journal/tomccap":{"venue": "TOMM", "rank": "B"},
    "journal/tosn":{"venue": "TOSN", "rank": "B"},
    "journal/cn":{"venue": "CN", "rank": "B"},
    "journal/tocm":{"venue": "TCOM", "rank": "B"},
    "journal/twc":{"venue": "TWC", "rank": "B"},

    // Rank C
    "journal/adhoc":{"venue": "Ad Hoc Networks", "rank": "C"},
    "journal/cc":{"venue": "CC", "rank": "C"},
    "journal/tnsm":{"venue": "TNSM", "rank": "C"},
    "journal/iet-comm":{"venue": "IET Communications", "rank": "C"},
    "journal/jnca":{"venue": "JNCA", "rank": "C"},
    "journal/monet":{"venue": "MONET", "rank": "C"},
    "journal/networks":{"venue": "Networks", "rank": "C"},
    "journal/ppna":{"venue": "PPNA", "rank": "C"},
    "journal/wicomm":{"venue": "WCMC", "rank": "C"},
    "journal/winet":{"venue": "Wireless Networks", "rank": "C"},
    "journal/iotj":{"venue": "IOT", "rank": "C"},
    

     /*
     * Conference
     */
    // Rank A
    "conf/sigcomm": { "venue": "SIGCOMM", "rank": "A"},
    "conf/mobicom": { "venue": "MobiCom", "rank": "A" },
    "conf/infocom": { "venue": "INFOCOM", "rank": "A" },
    "conf/nsdi": { "venue": "NSDI", "rank": "A" },

    // Rank B
    "conf/sensys": { "venue": "SenSys", "rank": "B" },
    "conf/conext": { "venue": "CoNEXT", "rank": "B" },
    "conf/secon": { "venue": "SECON", "rank": "B" },
    "conf/ipsn": { "venue": "IPSN", "rank": "B" },
    "conf/mobisys": { "venue": "MobiSys", "rank": "B" },
    "conf/mobihoc": { "venue": "MobiHoc", "rank": "B" },
    "conf/nossdav": { "venue": "NOSSDAV", "rank": "B" },
    "conf/iwqos": { "venue": "IWQoS", "rank": "B" },
    "conf/imc": { "venue": "IMC", "rank": "B" },
    "conf/icnp": { "venue": "ICNP", "rank": "B" },

    // Rank C
    "conf/ancs": { "venue": "ANCS", "rank": "C" },
    "conf/apnoms": { "venue": "APNOMS", "rank": "C" },
    "conf/forte": { "venue": "FORTE", "rank": "C" },
    "conf/lcn": { "venue": "LCN", "rank": "C" },
    "conf/globecom": { "venue": "GLOBECOM", "rank": "C" },
    "conf/icc": { "venue": "ICC", "rank": "C" },
    "conf/icccn": { "venue": "ICCCN", "rank": "C" },
    "conf/mass": { "venue": "MASS", "rank": "C" },
    "conf/p2p": { "venue": "P2P", "rank": "C" },
    "conf/ipccc": { "venue": "IPCCC", "rank": "C" },
    "conf/wowmom": { "venue": "WoWMoM", "rank": "C" },
    "conf/iscc": { "venue": "ISCC", "rank": "C" },
    "conf/wcnc": { "venue": "WCNC", "rank": "C" },
    "conf/networking": { "venue": "Networking", "rank": "C" },
    "conf/im": { "venue": "IM", "rank": "C" },
    "conf/msn": { "venue": "MSN", "rank": "C" },
    "conf/wswim": { "venue": "MSWiM", "rank": "C" },
    "conf/wasa": { "venue": "WASA", "rank": "C" },
    "conf/hotnets": { "venue": "HotNets", "rank": "C" },
    "conf/apnet": { "venue": "APNet", "rank": "C" },
};

let CIS = {
    // Journal
    // Rank A
    "journals/tdsc": { "venue": "TDSC", "rank": "A" }, 
    "journals/tifs": { "venue": "TIFS", "rank": "A" },
    "journals/joc": { "venue": "Journal of Cryptology", "rank": "A" },

    // Rank B
    "journals/tissec": { "venue": "TOPS", "rank": "B" },
    "journals/composec": { "venue": "Computers & Security", "rank": "B" },
    "journals/dcc": { "venue": "Designs,Codes and Cryptography", "rank": "B" },

    // Rank C
    "journals/clsr": { "venue": "CLSR", "rank": "C" },
    "journals/ejisec": { "venue": "EURASIP Journal on Information Security", "rank": "C" },
    "journals/iet-ifs": { "venue": "IET Information Security", "rank": "C" },
    "journals/imcs": { "venue": "IMCS", "rank": "C" },
    "journals/ijics": { "venue": "IJICS", "rank": "C" },
    "journals/ijisp": { "venue": "IJISP", "rank": "C" },
    "journals/jisa": { "venue": "JISA", "rank": "C" },
    "journals/scn": { "venue": "SCN", "rank": "C" },
    "journals/cybersec": { "venue": "Cybersecurity", "rank": "C" },

    // Conference
    // Rank A
    "conf/ccs": { "venue": "CCS", "rank": "A" },
    "conf/eurocrypt": { "venue": "EUROCRYPT", "rank": "A" },
    "conf/sp": { "venue": "S&P", "rank": "A" },
    "conf/crypto": { "venue": "CRYPTO", "rank": "A" },
    "conf/uss": { "venue": "USENIX Security", "rank": "A" },
    "conf/ndss": { "venue": "NDSS", "rank": "A" },

    // Rank B
    "conf/acsac": { "venue": "ACSAC", "rank": "B" },
    "conf/asiacrypt": { "venue": "ASIACRYPT", "rank": "B" },
    "conf/esorics": { "venue": "ESORICS", "rank": "B" },
    "conf/fse": { "venue": "FSE", "rank": "B" },
    "conf/csfw": { "venue": "CSFW", "rank": "B" },
    "conf/srds": { "venue": "SRDS", "rank": "B" },
    "conf/ches": { "venue": "CHES", "rank": "B" },
    "conf/dsn": { "venue": "DSN", "rank": "B" },
    "conf/raid": { "venue": "RAID", "rank": "B" },
    "conf/pkc": { "venue": "PKC", "rank": "B" },
    "conf/tcc": { "venue": "TCC", "rank": "B" },

    // Rank C
    "conf/wisec": { "venue": "WiSec", "rank": "C" },
    "conf/sacmat": { "venue": "SACMAT", "rank": "C" },
    "conf/drm": { "venue": "DRM", "rank": "C" },
    "conf/ih": { "venue": "IH&MMSec", "rank": "C" },
    "conf/acns": { "venue": "ACNS", "rank": "C" },
    "conf/aisaccs": { "venue": "AsiaCCS", "rank": "C" }, 
    "conf/acisp": { "venue": "ACISP", "rank": "C" },
    "conf/ctrsa": { "venue": "CT-RSA", "rank": "C" },
    "conf/dimva": { "venue": "DIMVA", "rank": "C" },
    "conf/dfrws": { "venue": "DFRWS", "rank": "C" },
    "conf/fc": { "venue": "FC", "rank": "C" },
    "conf/trustcom": { "venue": "TrustCom", "rank": "C" },
    "conf/sec": { "venue": "SEC", "rank": "B" }, 
    "conf/ifip11-9": { "venue": "IFIP WG 11.9", "rank": "C" },
    "conf/isw": { "venue": "ISC", "rank": "C" },
    "conf/icdf2c": { "venue": "ICDF2C", "rank": "C" },
    "conf/icics": { "venue": "ICICS", "rank": "C" },
    "conf/securecomm": { "venue": "SecureComm", "rank": "C" },
    "conf/nspw": { "venue": "NSPW", "rank": "C" },
    "conf/pam": { "venue": "PAM", "rank": "C" },
    "conf/pet": { "venue": "PETS", "rank": "C" },
    "conf/sacrypt": { "venue": "SAC", "rank": "C" },
    "conf/soups": { "venue": "SOUPS", "rank": "C" },
    "conf/hotsec": { "venue": "HotSec", "rank": "C" },
    "conf/eurosp": { "venue": "EuroS&P", "rank": "C" },
    "conf/cisc": { "venue": "Inscrypt", "rank": "C" },
};

/* 
 * ------------------------------------------------------------
 * 
 * 数据库/数据挖掘/内容检索
 *
 * (Database/Data Mining/Content Retrieval)
 * 
 * ------------------------------------------------------------
 */
let DB_DM_CR = {
    "journals/pvldb": { "venue": "VLDB", "rank": "A" },

    // Conference
    // Rank A
    "conf/sigmod": { "venue": "SIGMOD", "rank": "A" },
    "conf/kdd": { "venue": "SIGKDD", "rank": "A" },
    "conf/icde": { "venue": "ICDE", "rank": "A" },
    "conf/sigir": { "venue": "SIGIR", "rank": "A" },
    "conf/vldb": { "venue": "VLDB Workshop", "rank": "A" },

    // Rank B
    "conf/cikm": { "venue": "CIKM", "rank": "B"},
    "conf/wsdm": { "venue": "WSDM", "rank": "B"},
    "conf/icdm": { "venue": "ICDM", "rank": "B"},
    "conf/recsys": { "venue": "RecSys", "rank": "B" },
};

/* 
 * ------------------------------------------------------------
 * 
 * 人工智能
 * 
 * (Artificial Intelligence)
 *
 * ------------------------------------------------------------
 */
let AI = {
    "conf/aaai": { "venue": "AAAI", "rank": "A" },
    "conf/nips": { "venue": "NeurIPS", "rank": "A" },
    "conf/icml": { "venue": "ICML", "rank": "A" },
    "conf/ijcai": { "venue": "IJCAI", "rank": "A" },
};

let INTERDISCIPLINARY_EMERGING = {
    "conf/www": { "venue": "WWW", "rank": "A" },
};

/* 
 * ------------------------------------------------------------
 * 
 * 计算机科学理论
 *
 * (Computer Science Theory)
 * ------------------------------------------------------------
 */
let TCS = {
    // Journal
    // Rank A
    "journal/tit":{"venue": "TIT", "rank": "A"},
    "journal/iandc":{"venue": "IANDC", "rank": "A"},
    "journal/siamcomp":{"venue": "SICOMP", "rank": "A"},

    // Rank B
    "journal/talg":{"venue": "TALG", "rank": "B"},
    "journal/tocl":{"venue": "TOCL", "rank": "B"},
    "journal/toms":{"venue": "TOMS", "rank": "B"},
    "journal/algorithmica":{"venue": "Algorithmica", "rank": "B"},
    "journal/cc":{"venue": "CC", "rank": "B"},
    "journal/fac":{"venue": "FAC", "rank": "B"},
    "journal/fmsd":{"venue": "FMSD", "rank": "B"},
    "journal/informs":{"venue": "INFORMS", "rank": "B"},
    "journal/jcss":{"venue": "JCSS", "rank": "B"},
    "journal/jgo":{"venue": "JGO", "rank": "B"},
    "journal/jsc":{"venue": "JSC", "rank": "B"},
    "journal/mscs":{"venue": "MSCS", "rank": "B"},
    "journal/tcs":{"venue": "TCS", "rank": "B"},
    
    // Rank C
    "journal/acta":{"venue": "ACTA", "rank": "C"},
    "journal/apal":{"venue": "APAL", "rank": "C"},
    "journal/dam":{"venue": "DAM", "rank": "C"},
    "journal/fuin":{"venue": "FUIN", "rank": "C"},
    "journal/ipl":{"venue": "IPL", "rank": "C"},
    "journal/jc":{"venue": "JCOMPLEXITY", "rank": "C"},
    "journal/logcom":{"venue": "LOGCOM", "rank": "C"},
    "journal/jsyml":{"venue": "JSL", "rank": "C"},
    "journal/lmcs":{"venue": "LMCS", "rank": "C"},
    "journal/siamda":{"venue": "SIDMA", "rank": "C"},
    // "journal/mst":{"venue": "TCS", "rank": "C"},

    // Conference
    // Rank A
    "conf/stoc": { "venue": "STOC", "rank": "A" },
    "conf/soda": { "venue": "SODA", "rank": "A" },
    "conf/cav": { "venue": "CAV", "rank": "A" },
    "conf/lics": { "venue": "LICS", "rank": "A" },
    
    // Rank B
    "conf/compgeom": { "venue": "SoCG", "rank": "B" },
    "conf/esa": { "venue": "ESA", "rank": "B" },
    "conf/coco": { "venue": "CCC", "rank": "B" },
    "conf/icalp": { "venue": "ICALP", "rank": "B" },
    // "conf/cade": { "venue": "CADE", "rank": "B" },
    "conf/concur": { "venue": "CONCUR", "rank": "B" },
    "conf/hybrid": { "venue": "HSCC", "rank": "B" },
    "conf/sat": { "venue": "SAT", "rank": "B" },
    "conf/cocoon": { "venue": "COCOON", "rank": "B" },
     
    // Rank C
     "conf/csl": { "venue": "CSL", "rank": "C" },
     "conf/fmcad": { "venue": "FMCAD", "rank": "C" },
     "conf/fsttcs": { "venue": "FSTTCS", "rank": "C" },
     "conf/dsaa": { "venue": "DSAA", "rank": "C" },
     "conf/ictac": { "venue": "ICTAC", "rank": "C" },
     "conf/ipco": { "venue": "IPCO", "rank": "C" },
     "conf/rta": { "venue": "RTA", "rank": "C" },
     "conf/isaac": { "venue": "ISAAC", "rank": "C" },
     "conf/mfcs": { "venue": "MFCS", "rank": "C" },
     "conf/stacs": { "venue": "STACS", "rank": "C" },
     "conf/setta": { "venue": "SETTA", "rank": "C" },
};

/* 
 * ------------------------------------------------------------
 * 
 * 计算机图形学与多媒体
 *
 * (Computer Graphics and Multimedia)
 * 
 * ------------------------------------------------------------
 */
let CGM = {
    // Journal
    // Rank A
    "journal/tog":{"venue": "TOG", "rank": "A"},
    "journal/tip":{"venue": "TIP", "rank": "A"},
}   

/* 
 * --------------------------------------------------------------------------------------
 * 
 * The following journals or conferences are not in the recommended list, but should in.
 *
 * --------------------------------------------------------------------------------------
*/
let OTHERS  = {
    // They are equivalent to Rank A.
    // ACM Computing Surveys
    "journals/csur": { "venue": "ACM Comput. Surv.", "rank": "A" },
    // Communications of the ACM
    "journals/cacm": { "venue": "Commun. ACM", "rank": "A" },
    "conf/iclr": {"venue": "ICLR", "rank": "A"},

    // They are equivalent to Rank B.
};

/* 
 * ------------------------------------------------------------
 * 
 * End: The CCF Recommended List
 *
 * ------------------------------------------------------------
 */
let categoryList = [ARCH_DCP_SS, SE_SS_PDL, DB_DM_CR, AI, INTERDISCIPLINARY_EMERGING, CN, CIS, OTHERS];
let CCF_LIST = {};
let CCF_VENUE_RANK_LIST = new Map();

for (var category of categoryList) {
    for (var key in category) {
        CCF_LIST[key] = category[key];
        CCF_VENUE_RANK_LIST.set(CCF_LIST[key].venue, CCF_LIST[key].rank);
    }
}
