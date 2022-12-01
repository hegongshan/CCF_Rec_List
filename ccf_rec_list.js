let CCF_LIST = {
    // Storage
    "conf/fast": { "venue": "FAST", "rank": "A" },
    "conf/usenix": { "venue": "USENIX ATC", "rank": "A" },
    "conf/osdi": { "venue": "OSDI", "rank": "A" },
    "conf/sosp": { "venue": "SOSP", "rank": "A" },
    "conf/sc": { "venue": "SC", "rank": "A" },
    "conf/eurosys": { "venue": "EuroSys", "rank": "A" },
    "conf/mss": { "venue": "MSST", "rank": "B" },
    "conf/systor": { "venue": "SYSTOR", "rank": "C" },
    "journals/tos": { "venue": "TOS", "rank": "A" },
    "journals/tpds": { "venue": "TPDS", "rank": "A" },

    // Computer System
    "journals/tocs": { "venue": "TOCS", "rank": "A" },
    "journals/tc": { "venue": "TC", "rank": "A" },
    "journals/tcad": { "venue": "TCAD", "rank": "A" },
    "conf/ppopp": { "venue": "PPoPP", "rank": "A"},
    "conf/dac": { "venue": "DAC", "rank": "A"},
    
    "conf/cloud": { "venue": "SoCC", "rank": "B"},
    "conf/spaa": { "venue": "SPAA", "rank": "B"},
    "conf/podc": { "venue": "PODC", "rank": "B"},
    "conf/fpga": { "venue": "FPGA", "rank": "B"},
    "conf/cgo": { "venue": "CGO", "rank": "B"},
    "conf/date": { "venue": "DATE", "rank": "B"},
    "conf/cluster": { "venue": "CLUSTER", "rank": "B"},
    "conf/iccd": { "venue": "ICCD", "rank": "B"},
    "conf/iccad": { "venue": "ICCAD", "rank": "B"},
    "conf/icdcs": { "venue": "ICDCS", "rank": "B"},
    "conf/codes": { "venue": "CODES+ISSS", "rank": "B"},
    "conf/hipeac": { "venue": "HiPEAC", "rank": "B"},
    "conf/IEEEpact": { "venue": "PACT", "rank": "B"},
    "conf/icpp": { "venue": "ICPP", "rank": "B"},
    "conf/ics": { "venue": "ICS", "rank": "B"},
    "conf/ipps": { "venue": "IPDPS", "rank": "B"},
    "conf/vee": { "venue": "VEE", "rank": "B"},
    "conf/hpdc": { "venue": "HPDC", "rank": "B"},
    "conf/itc": { "venue": "ITC", "rank": "B"},
    "conf/lisa": { "venue": "LISA", "rank": "B"},
    "conf/rtas": { "venue": "RTAS", "rank": "B"},
    
    // performance analysis
    "conf/sigmetrics": { "venue": "SIGMETRICS", "rank": "B"},
    "conf/performance": { "venue": "Performance", "rank": "B"},
    "conf/ispass": { "venue": "ISPASS", "rank": "C"},

    // Database
    "journals/pvldb": { "venue": "VLDB", "rank": "A" },
    "conf/vldb": { "venue": "VLDB Workshop", "rank": "A" },
    "conf/sigmod": { "venue": "SIGMOD", "rank": "A" },
    "conf/icde": { "venue": "ICDE", "rank": "A" },

    // Computer Architecture
    "conf/isca": { "venue": "ISCA", "rank": "A" },
    "conf/micro": { "venue": "MICRO", "rank": "A" },
    "conf/hpca": { "venue": "HPCA", "rank": "A" },
    "conf/asplos": { "venue": "ASPOLS", "rank": "A" },

    // Artificial Intelligence
    "conf/aaai": { "venue": "AAAI", "rank": "A" },
    "conf/nips": { "venue": "NeurIPS", "rank": "A" },
    "conf/icml": { "venue": "ICML", "rank": "A" },
    "conf/ijcai": { "venue": "IJCAI", "rank": "A" },
    "conf/www": { "venue": "WWW", "rank": "A" },

    "conf/cikm": { "venue": "CIKM", "rank": "B"},
    "conf/wsdm": { "venue": "WSDM", "rank": "B"},
    "conf/icdm": { "venue": "ICDM", "rank": "B"},
    
    "conf/recsys": { "venue": "RecSys", "rank": "B" },

    /* 
     * --------------------------------------------------------------------------------------
     * 
     * The following journals or conferences are Not in the recommended list, but should in.
     *
     * --------------------------------------------------------------------------------------
    */
    // Survey
    // They are equivalent to Rank A.
    // ACM Computing Surveys
    "journals/csur": { "venue": "ACM Comput. Surv.", "rank": "A" },
    // Communications of the ACM
    "journals/cacm": { "venue": "Commun. ACM", "rank": "A" },
    "conf/iclr": {"venue": "ICLR", "rank": "A"},

    // They are equivalent to Rank B.
};

let CCF_VENUE_RANK_LIST = new Map();
for (let key in CCF_LIST) {
    CCF_VENUE_RANK_LIST.set(CCF_LIST[key].venue, CCF_LIST[key].rank);
}
