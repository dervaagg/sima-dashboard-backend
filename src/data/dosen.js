const dosen = [
    {
        nip: "196511071992031001",
        nama: "Dr. Aris Puji Widodo, S.Si, M.T.",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/rpl/dosen-RPL%E2%80%931.png",
    },
    {
        nip: "196511071992031002",
        nama: "Dr. Eng. Adi Wibowo, S.Si., M.Kom.",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/kg/KG-engAdi.png",
    },
    {
        nip: "196511071992031003",
        nama: "Drs. Eko Adi Sarwoko, M.Kom.",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/kg/KG-ekoAdi.png",
    },
    {
        nip: "197007051997021001",
        nama: "Priyo Sidik Sasongko, S.Si., M.Kom.",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/siscer/siscer-priyo.png",
    },
    {
        nip: "197108111997021004",
        nama: "Dr. Aris Sugiharto, S.Si., M.Kom.",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/kg/KG_arisSugi.png",
    },
    {
        nip: "197308291998022001",
        nama: "Beta Noranita, S.Si, M.Kom",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/sti/STI-Beta.png",
    },
    {
        nip: "197601102009122002",
        nama: "Dinar Mutiara K N, S.T., M.InfoTech.(Comp)., Ph.D.",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/sti/STI-Dinar.png",
    },
    {
        nip: "197805022005012002",
        nama: "Sukmawati Nur Endah, S.Si, M.Kom",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/siscer/siscer-sukma.png",
    },
    {
        nip: "197805162003121001",
        nama: "Helmie Arif Wibawa, S.Si, M.Cs",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/siscer/siscer-helmie.png",
    },
    {
        nip: "197902122008121002",
        nama: "Indra Waspada, ST, M.T.I",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/sti/STI-Indra.png",
    },
    {
        nip: "197905242009121003",
        nama: "Sutikno, ST, M.Cs",
        foto: null,
    },
    {
        nip: "197907202003121002",
        nama: "Nurdin Bahtiar, S.Si, M.T",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/sti/STI-nurdin.png",
    },
    {
        nip: "198009142006041002",
        nama: "Edy Suharto, S.T., M.Kom.",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/rpl/dosen-RPL%E2%80%932.png",
    },
    {
        nip: "198010212005011003",
        nama: "Ragil Saputra, S.Si, M.Cs",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/sti/STI-ragil.png",
    },
    {
        nip: "198104202005012001",
        nama: "Dr. Retno Kusumaningrum, S.Si, M.Kom",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/siscer/siscer-retno.png",
    },
    {
        nip: "198104212008121002",
        nama: "Panji Wisnu Wirawan, S.T., M.T.",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/rpl/dosen-RPL%E2%80%933.png",
    },
    {
        nip: "198302032006041002",
        nama: "Satriyo Adhy, S.Si, M.T",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/sti/STI-satriyo.png",
    },
    {
        nip: "198903032015042002",
        nama: "Khadijah, S.Kom, M.Cs",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/siscer/siscer-khadijah.png",
    },
    {
        nip: "198511252018032001",
        nama: "Rismiyati, B.Eng, M.Cs",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/siscer/siscer-rismi.png",
    },
    {
        nip: "198404112019031009",
        nama: "Fajar Agung Nugroho, S.Kom., M.Cs.",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/kg/KG-fajar.png",
    },
    {
        nip: "198803222020121010",
        nama: "Prajanto Wahyu Adi, M.Kom.",
        foto: "https://media-exp1.licdn.com/dms/foto/C5603AQEhx-S82FinbQ/profile-displayphoto-shrink_400_400/0/1625813298385?e=1671667200&v=beta&t=o9bMNDHxMAk1r-6UEcXwuz1F7CIPdBPB-UE1E805GuU",
    },
    {
        nip: "198106202015041002",
        nama: "Muhammad Malik Hakim, S.T., M.T.I.",
        foto: "https://hmif-undip.com/ios/assets/homepage/img/dosen/sti/STI-Malik.png",
    },
    {
        nip: "198012272015041002",
        nama: "Guruh Aryotejo, S.Kom., M.Sc.",
        foto: "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=t637M2oAAAAJ&citpid=2",
    },
    {
        nip: "H.7.199112092022041001",
        nama: "Adhe Setya Pramayoga, S.Kom., M.T.",
        foto: null,
    },
    {
        nip: "H.7.199603032022041001",
        nama: "Sandy Kurniawan, S.Kom., M.Kom.",
        foto: null,
    },
    {
        nip: "199406050220071040",
        nama: "Anang Ardiyanto",
        foto: "https://if.fsm.undip.ac.id/id//assets/img/tendik/anang1.png",
    },
    {
        nip: "198611050214011680",
        nama: "Beny Nugroho",
        foto: "https://if.fsm.undip.ac.id/id//assets/img/tendik/beny1.png",
    },
    {
        nip: "198911010214012670",
        nama: "Annisa Istiadah N., A.Md.",
        foto: "https://if.fsm.undip.ac.id/id//assets/img/tendik/annisa1.png",
    },
];

module.exports = { dosen };
