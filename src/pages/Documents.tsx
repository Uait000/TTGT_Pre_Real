import MainLayout from '@/components/MainLayout'; 
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom'; 

import doc from '@/assets/pictures/doc.jpg';
import d1 from '@/assets/file/doc/deloproizv_vkr_29.05.2020.pdf';
import d2 from '@/assets/file/doc/fz_436.pdf';
import d3 from '@/assets/file/doc/fz_439.pdf';
import d4 from '@/assets/file/doc/izm_polozh_o_perekhode_s_platnogo_na_besplatnoe_2025.pdf';
import d5 from '@/assets/file/doc/izm_v_poriadke_provedeniia_gia_po_spo_14_05_24.pdf';
import d6 from '@/assets/file/doc/kodekc.pdf';
import d7 from '@/assets/file/doc/Kompl_Programma_Vospitaniya_29.01.2018.pdf';
import d8 from '@/assets/file/doc/KonVospitaniya_29.01.2018.pdf';
import d9 from '@/assets/file/doc/Obrazec_zayavl.pdf';
import d10 from '@/assets/file/doc/Otchet_o_vipoln_goszadaniya_2022.pdf';
import d11 from '@/assets/file/doc/pamiatka_strakhovateliu_etk_ot_pfr_ro.pdf';
import d12 from '@/assets/file/doc/Plan_k_otop_sez_25_26_krasnoarm_47a.pdf';
import d13 from '@/assets/file/doc/Plan_k_otop_sez_25_26_krasnoarm_53.pdf';
import d14 from '@/assets/file/doc/Plan_k_otop_sez_25_26_krasnoarm_57.pdf';
import d15 from '@/assets/file/doc/Plan_protiv_terror_2024.pdf';
import d16 from '@/assets/file/doc/Pol_gos_ekzamen_24_11_2023.pdf';
import d17 from '@/assets/file/doc/pol_gyr.pdf';
import d18 from '@/assets/file/doc/pol_kom_po_sporam_2024.pdf';
import d19 from '@/assets/file/doc/Pol_mobiln_31.08.2021.pdf';
import d20 from '@/assets/file/doc/Pol_o_dop_st_org_RGUPS_28020222.pdf';
import d21 from '@/assets/file/doc/Pol_o_kl_ruk_24.01.2022.pdf';
import d22 from '@/assets/file/doc/Pol_o_podg_i_zashhit_DP_27122022.pdf';//
import d23 from '@/assets/file/doc/Pol_o_prov_GIA_SPO_27122022.pdf';
import d24 from '@/assets/file/doc/Pol_o_prov_voen_sborov_22.05.2023.pdf';//
import d25 from '@/assets/file/doc/pol_o_rassled._neschastn._sluch._21.02.23.pdf';
import d26 from '@/assets/file/doc/Pol_o_sam_rab_ob_SPO_27122022.pdf';//
import d27 from '@/assets/file/doc/Pol_o_sam_rabote_ob_SPO_21.06.2021.pdf';
import d28 from '@/assets/file/doc/Pol_o_soc_psih_sl_15_05_24.pdf';//
import d29 from '@/assets/file/doc/Pol_otkryt_urok_29_11_2023.pdf';
import d30 from '@/assets/file/doc/Pol_prakt_podg_27.11.2020.pdf';//
import d31 from '@/assets/file/doc/Pol_prov_DE_SPO_27122022.pdf';
import d32 from '@/assets/file/doc/Pol_prved_practich_i_labor_zanyatiy_21.06.2021.pdf';//
import d33 from '@/assets/file/doc/Pol_Skolf_nachin_prepodav_04_10_2024.pdf';
import d34 from '@/assets/file/doc/Pol_starostat_14.01.2020.pdf';
import d35 from '@/assets/file/doc/Polog_O_kom_po_trud_sporam_20.02.2021.pdf';//
import d36 from '@/assets/file/doc/Polog_Podgot_vodit_B_25.01.2021.pdf';
import d37 from '@/assets/file/doc/Pologenie_arxiv_10_06_2024.pdf';//
import d38 from '@/assets/file/doc/Pologenie_EIOS_29.01.2018.pdf';
import d39 from '@/assets/file/doc/Pologenie_EIOS_izm_15.05.2024.pdf';//
import d40 from '@/assets/file/doc/Pologenie_o_propusknom_rezime_29_11_2023.pdf';
import d41 from '@/assets/file/doc/Pologenie_o_videonabludenii_31.03.2017.pdf';//
import d42 from '@/assets/file/doc/Pologenie_ob_otdele_Kadrov_30.06.2020.pdf';
import d43 from '@/assets/file/doc/Pologenie_ob_UchebKabinete_10.09.2019.pdf';//
import d44 from '@/assets/file/doc/Pologenie_po_organ_vypoln_i_zashhity_KR_20.02.2021.pdf';//
import d45 from '@/assets/file/doc/Pologenie_rejting_prep_01072024.pdf';//
import d46 from '@/assets/file/doc/Pologenie_Smotr_Konkurs_Kabimetov_30.06.2020.pdf';
import d47 from '@/assets/file/doc/Pologenie_SovetProfilPravonar_TTGT_03.09.2018.pdf';//
import d48 from '@/assets/file/doc/Pologenie_StudSovet_TTGT_14.01.2020.pdf';
import d49 from '@/assets/file/doc/pologenie_ttgt_29.01.2016.pdf';//
import d50 from '@/assets/file/doc/PologOSoziokulture_29.01.2018.pdf';
import d51 from '@/assets/file/doc/polozh._o_poriadke_formir._opop_spo_rgups_ot_25.06.2021.pdf';
import d52 from '@/assets/file/doc/polozh__o_perekhode_s_platnogo_na_besplatnoe_2024.pdf';//
import d53 from '@/assets/file/doc/Polozh_FormFondOczenSr_28022014.pdf';
import d54 from '@/assets/file/doc/Polozh_o_kvalifikacion_examene_26.04.2019.pdf';//
import d55 from '@/assets/file/doc/polozhenie_o_PD_03_11_2023.pdf';//
import d56 from '@/assets/file/doc/polozhenie_o_por._zapoln.-_ucheta_i_vydachi_svid._o_professii_rabochego.pdf';
import d57 from '@/assets/file/doc/polozhenie_o_vyp._ind._proekta_obuch-sia_1_kursa_ot_27.12.220001_podpisan.pdf';
import d58 from '@/assets/file/doc/polozhenie_ob_organizatcii_i_provedenii_vnutrennei_sistemy_otcenki_ka.pdf';//
import d59 from '@/assets/file/doc/Polozhenie_sajt_15.05.2024.pdf';
import d60 from '@/assets/file/doc/Poryadok_Deystv_Personala_Ter_15.08.2023.pdf';//
import d61 from '@/assets/file/doc/Prikaz_Isp_Smart_Karty_13_11_2023.pdf';
import d62 from '@/assets/file/doc/Prikaz_kom_po_uregul_sporov_01_09_2025.pdf';
import d63 from '@/assets/file/doc/Prikaz_o_lokalnih_normativnih_aktah_rgups_08.12.2015.pdf';
import d64 from '@/assets/file/doc/Prikaz_o_lokalnih_normativnih_aktah_ttgt_28.03.2017.pdf';
import d66 from '@/assets/file/doc/Protokol_1_perexod_TTGT_16.02.2022.pdf';
import d67 from '@/assets/file/doc/Protokol_1_perexod_TTGT_31.01.2025.pdf';
import d68 from '@/assets/file/doc/Protokol_2_perexod_TTGT_02.10.2023.pdf';//
import d69 from '@/assets/file/doc/Protokol_2_perexod_TTGT_03.10.2024.pdf';
import d70 from '@/assets/file/doc/Protokol_2_perexod_TTGT_28.09.2022.pdf';//
import d71 from '@/assets/file/doc/Protokol_3_perexod_TTGT_01_10_2025.pdf';//
import d72 from '@/assets/file/doc/San_Epid_Zakl_15.11.2017.pdf';
import d73 from '@/assets/file/doc/Sostav_Profsous_stud_2024.pdf';//
import d74 from '@/assets/file/doc/stud_sovet_2024_2025.pdf';
import d75 from '@/assets/file/doc/zakl_pozh_12.07.2019.pdf';//
import d76 from '@/assets/file/doc/Uvedomlenie.pdf';

// --- Добавлены недостающие протоколы ---
import d81 from '@/assets/file/doc/Protokol_1_perexod_ttgt_13.02.2023.pdf';
import d82 from '@/assets/file/doc/Protokol_1_perexod_ttgt_13.02.2024.pdf';


const Documents = () => {
    const documentSections = [
        {
            title: 'Организационные документы и приказы',
            documents: [
                {
                    title: 'Положение о Тихорецком техникуме железнодорожного транспорта - филиале федерального государственного бюджетного образовательного учреждения высшего образования "Ростовский государственный университет путей сообщения"',
                    url: d49
                },
                {
                    title: 'Приказ РГУПС от 08.12.15 № 1829/ос "О локальных нормативных актах"',
                    url: d63 
                },
                {
                    title: 'Приказ от 28.03.2017 г. № 84/од "О локальных нормативных актах ТТЖТ - филиала РГУПС"',
                    url: d64
                }
            ]
        },
        {
            title: 'Образовательная деятельность',
            documents: [
                {
                    title: 'Положение о об особенностях проведения текущего контроля успеваемости и промежуточной аттестации обучающихся, порядка проведения государственной итоговой аттестации по образовательным программам среднего профессионального образования в условиях усиления санитарно-эпидемиологических мероприятий от 24.04.2020',
                    url: "https://www.rgups.ru/site/assets/files/50189/polozhenie_o_tek._konr._i_gia_po_spo_vrem._.pdf" 
                },
                {
                    title: 'Положение о порядке делопроизводства в ходе защиты выпускных квалификационных работ по основным программам высшего и среднего профессионального образования, защищенных в условиях неблагоприятной санитарно-эпидемиологической обстановки в Российской Федерации от 29.05.2020 г.',
                    url: d1
                },
                {
                    title: 'Порядок организации и осуществления образовательной деятельности ФГБОУ ВО РГУПС по образовательным программам среднего профессионального образования',
                    url: 'https://www.rgups.ru/site/assets/files/50189/polozhenie_ob_org._i_osushch._obraz._deiat-ti_ot_27.12.220001_podpisan.pdf' 
                },
                {
                    title: 'Положение о формах, периодичности и порядке проведения текущего контроля успеваемости и промежуточной аттестации обучающихся по образовательным программам среднего профессионального образования',
                    url:'https://rgups.ru/site/assets/files/50189/polozhenie_o_promezhut__attest__spo-2025_podpisan.pdf' 
                },
                {
                    title: 'Положение о формах, периодичности и порядке проведения промежуточной аттестации обучающихся по основным программам профессионального обучения',
                    url: 'https://www.rgups.ru/site/assets/files/90788/formi_sroki_prom_attest_15.11.2019.pdf' 
                },
                {
                    title: 'Положение о практической подготовке обучающихся, осваивающих основные профессиональные образовательные программы в ФГБОУ ВО РГУПС',
                    url: d30
                },
                {
                    title: 'Положение о квалификационном экзамене по профессиональному модулю по основным профессиональным образовательным программам среднего профессионального образования',
                    url: d54
                },
                {
                    title: 'Положение о выполнении индивидуального проекта обучающимися 1 курса по образовательным программам среднего профессионального образования в рамках реализации стандарта среднего общего образования',
                    url: d57 
                },
                {
                    title: 'Положение о подготовке и защите дипломного проекта (работы) по основным профессиональным образовательным программам среднего профессионального образования',
                    url: d22
                },
                {
                    title: 'Положение о порядке проведения государственной итоговой аттестации по образовательным программам среднего профессионального образования',
                    url: d23
                },
                {
                    title: 'Изменение в Положение о порядке проведения государственной итоговой аттестации по образовательным программам среднего профессионального образования',
                    url: d5
                },
                {
                    title: 'Положение об организации и проведении государственного экзамена обучающихся по образовательным программам среднего профессионального образования в рамках государственной итоговой аттестации',
                    url: d16
                },
                {
                    title: 'Положение об организации и проведении демонстрационного экзамена по образовательным программам среднего профессионального образования',
                    url: d31
                },
                {
                    title: 'Положение по организации выполнения и защиты курсовой работы (проекта) студентов ТТЖТ — филиала ФГБОУ ВО РГУПС',
                    url: d44 
                },
                {
                    title: 'Положение о формировании фонда оценочных средств',
                    url: d53
                },
                {
                    title: 'Положение о порядке формирования основных профессиональных образовательных программ среднего профессионального образования в ФГБОУ ВО РГУПС',
                    url: d51
                },
                {
                    title: 'Положение о журнале учебных занятий',
                    url: d17 
                },
                {
                    title: 'Положение о порядке заполнения, учета и выдачи свидетельств о профессии рабочего, должности служащего и их дубликатов',
                    url: d56
                },
                {
                    title: 'Положение об учебном кабинете (лаборатории, мастерской) ТТЖТ - филиала РГУПС',
                    url: d43
                },
                {
                    title: 'Положение о смотре-конкурсе кабинетов и/или лабораторий ТТЖТ - филиала РГУПС',
                    url: d46
                },
                {
                    title: 'Положение по подготовке водителей транспортных средств категории "В"',
                    url: d36
                },
                {
                    title: 'Положение о самостоятельной работе студентов ФГБОУ ВО РГУПС, обучающихся по программам среднего профессионального образования',
                    url: d26
                },
                {
                    title: 'Положение о самостоятельной работе обучающихся по образовательным программам среднего профессионального образования в ТТЖТ - филиале РГУПС',
                    url: d27
                },
                {
                    title: 'Положение по планированию, организации и проведению практической подготовки обучающихся, при проведении практических и лабораторных занятий в ТТЖТ - филиале РГУПС',
                    url: d32
                },
                {
                    title: 'Положение о проведении внутренней независимой оценки качества образования в ТТЖТ - филиале РГУПС',
                    url: '#' 
                },
                {
                    title: 'Положение об организации и проведении внутренней системы оценки качества образования по программам подготовки специалистов среднего звена',
                    url: d58
                },
                {
                    title: 'Положение о проведении пятидневных учебных сборов с обучающимися в ТТЖТ – филиале РГУПС',
                    url: d24
                },
                {
                    title: 'Положение об организации и проведении открытого урока в ТТЖТ - филиале РГУПС',
                    url: d29
                }
            ]
        },
        {
            title: 'Перевод студентов с платного обучения на бесплатное',
            documents: [
                {
                    title: 'Положение о комиссии по переходу студентов ФГБОУ ВО РГУПС с платного обучения на бесплатное от 28.06.2024 г.',
                    url: d52
                },
                {
                    title: 'Изменения в положение о комиссии по переходу студентов ФГБОУ ВО РГУПС с платного обучения на бесплатное',
                    url: d4
                },
                {
                    title: 'Протокол заседания комиссии по переводу обучающихся с платного обучения на бесплатное от 16.02.2022 г. № 1',
                    url: d66
                },
                {
                    title: 'Протокол заседания комиссии по переводу обучающихся с платного обучения на бесплатное от 28.09.2022 г. № 2',
                    url: d70
                },
                {
                    title: 'Протокол заседания комиссии по переводу обучающихся с платного обучения на бесплатное от 13.02.2023 г. № 1',
                    url: d81 
                },
                {
                    title: 'Протокол заседания комиссии по переводу обучающихся с платного обчуения на бесплатное от 02.10.2023 г. № 2',
                    url: d68
                },
                {
                    title: 'Протокол заседания комиссии по переводу обучающихся с платного обучения на бесплатное от 13.02.2024 г. № 1',
                    url: d82 
                },
                {
                    title: 'Протокол заседания комиссии по переводу обучающихся с платного обучения на бесплатное от 03.10.2024 г. № 2',
                    url: d69
                },
                {
                    title: 'Протокол заседания комиссии по переходу обучающихся с платного обучения на бесплатное от 31.01.2025 г. № 1',
                    url: d67
                },
                {
                    title: 'Протокол заседания комиссии по переходу обучающихся ТТЖТ - филиала РГУПС с платного обучения на обучение за счет средств бюджетных ассигнований федерального бюджета от 01.10.2025 г. № 3',
                    url: d71
                }
            ]
        },
        {
            title: 'Воспитательная работа и социальная сфера',
            documents: [
                {
                    title: 'Положение о комиссии по регулированию споров между участниками образовательных отношений',
                    url: d18
                },
                {
                    title: 'Приказ о создании комиссии по урегулированию споров между участниками образовательных отношений',
                    url: d62 
                },
                {
                    title: 'Состав студенческого профсоюзного комитета',
                    url: d73
                },
                {
                    title: 'Положение о совете профилактики правонарушений среди обучающихся',
                    url: d47
                },
                {
                    title: 'Положение о социально-психологической службе',
                    url: d28
                },
                {
                    title: 'Положение о старостате',
                    url: d34
                },
                {
                    title: 'Состав Совета обучающихся (студенческого совета)',
                    url: d74
                },
                {
                    title: 'Положение о Студенческом совете (совете обучающихся)',
                    url: d48
                },
                {
                    title: 'Концепция воспитания студентов и обучающихся ТТЖТ - филиала РГУПС',
                    url: d8
                },
                {
                    title: 'Комплексная программа воспитания студентов ТТЖТ - филиала РГУПС (на цикл обучения)',
                    url: d7
                },
                {
                    title: 'Положение о социокультурной среде ТТЖТ - филиала РГУПС',
                    url: d50
                },
                {
                    title: 'Положение об использовании личных мобильных электронных устройств в ТТЖТ - филиале РГУПС',
                    url: d19
                },
                {
                    title: 'Положение о классном руководстве в ТТЖТ - филиале РГУПС',
                    url: d21
                },
                {
                    title: 'Положение о порядке расследования и учета несчастных случаев с обучающимися во время пребывания в ФГБОУ ВО РГУПС',
                    url: d25
                },
                {
                    title: 'План реализации мероприятий разделов Комплексного плана противодействия идеологии терроризма в Российской Федерации на 2024 - 2028 голды в ТТЖТ - филиале РГУПС на 2024 - 2025 учебный год',
                    url: d15
                }
            ]
        },
        {
            title: 'Кадровое обеспечение образовательной деятельности',
            documents: [
                {
                    title: 'Кодекс профессиональной этики педагогических работников Тихорецкого техникума железнодорожного транспорта - филиала РГУПС',
                    url: d6
                },
                {
                    title: 'Положение об установлении рейтингового учета показателей работы преподавателей ТТЖТ-филиала РГУПС за учебный семестр',
                    url: d45
                },
                {
                    title: 'Положение об отделе кадров ТТЖТ - филиала РГУПС',
                    url: d42
                },
                {
                    title: 'Положение о комиссии по трудовым спорам',
                    url: d35
                },
                {
                    title: 'Положение о персональных данных от 03.11.2023 г.',
                    url: d55
                },
                {
                    title: 'Положение о Школе начинающего преподавателя в ТТЖТ - филиал РГУПС',
                    url: d33
                }
            ]
        },
        {
            title: 'Информационно-коммуникационное сопровождение деятельности техникума',
            documents: [
                {
                    title: 'Положение об электронной информационно-образовательной среде ТТЖТ - филиале РГУПС',
                    url: d38
                },
                {
                    title: 'Изменения в Положение об электронной информационно-образовательной среде ТТЖТ - филиале РГУПС',
                    url: d39
                },
                {
                    title: 'Положение о веб-сайте ТТЖТ - филиала РГУПС',
                    url: d59 
                }
            ]
        },
        {
            title: 'Финансово-хозяйственная деятельность техникума',
            documents: [
                {
                    title: 'Отчет о выполнении государственного задания',
                    url: d10
                }
            ]
        },
        {
            title: 'Административно-хозяйственное обеспечение деятельности техникума',
            documents: [
                {
                    title: 'Санитарно-эпидемиологическое заключение',
                    url: d72
                },
                {
                    title: 'Заключение о соответствии объекта защиты обязательным требованиям пожарной безопасности',
                    url: d75
                },
                {
                    title: 'Положение о видеонаблюдении',
                    url: d41
                },
                {
                    title: 'Положение об архиве',
                    url: d37
                },
                {
                    title: 'Положение об организации внутриобъектового и пропускного режима в ТТЖТ - филиале РГУПС',
                    url: d40
                },
                {
                    title: 'Положение о допуске сторонних организаций к производству работ на объектах (территории) ФГБОУ ВО РГУПС',
                    url: d20
                },
                {
                    title: 'Порядок действий административного, преподавательского состава и обучающихся в ТТЖТ – филиале РГУПС, работников охранной организации и иных лиц, задействованных в охране объектов ТТЖТ – филиала РГУПС, к действиям при совершении (угрозе совершения) преступления террористической направленности',
                    url: d60 
                },
                {
                    title: 'Приказ "Об использовании смарт-карт"',
                    url: d61 
                },
                {
                    title: 'План подготовки к отопительному сезону 2025-2026 гг. (г. Тихорецк, ул. Красноармейская, д. № 57)',
                    url: d14
                },
                {
                    title: 'План подготовки к отопительному сезону 2025-2026 гг. (г. Тихорецк, ул. Красноармейская, д. № 53)',
                    url: d13
                },
                {
                    title: 'План подготовки к отопительному сезону 2025-2026 гг. (г. Тихорецк, ул. Красноармейская, д. № 47а)',
                    url: d12
                }
            ]
        },
        {
            title: 'Документы об организации образовательного процесса и по обеспечению доступа в техникуме инвалидов и лиц с ограниченными возможностями здоровья',
            internalLink: '/accessible-environment', 
            documents: []
        },
        {
            title: 'Формирование сведений о трудовой деятельности в электронном виде ("Электронная трудовая книжка")',
            documents: [
                {
                    title: 'Образцы заявлений',
                    url: d9
                },
                {
                    title: 'Федеральный закон №436',
                    url: d2
                },
                {
                    title: 'Федеральный закон №439',
                    url: d3
                },
                {
                    title: 'Памятка Страхователю ЭТК от ПФР РО',
                    url: d11
                },
                {
                    title: 'Уведомление О формировании и ведении сведений о трудовой деятельности в электронном виде',
                    url: d76
                }
            ]
        }
    ];

    return (
        <MainLayout>

            
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                <h1 className="text-3xl font-bold text-primary mb-8 text-center">Документы</h1>
                
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                    <div className="w-full aspect-[16/6] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden shadow-lg mb-8">
                        <img
                            src={doc}
                            alt="Документы техникума"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="space-y-8">
                        {documentSections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="bg-white rounded-lg p-6 shadow-sm">
                                
                                {'internalLink' in section ? (
                                    <Link to={section.internalLink as string}>
                                        <h2 className="text-xl font-semibold text-primary hover:text-primary-hover hover:underline transition-all mb-6 border-b border-primary/20 pb-3">
                                            {section.title}
                                        </h2>
                                    </Link>
                                ) : (
                                    <h2 className="text-xl font-semibold text-primary mb-6 border-b border-primary/20 pb-3">
                                        {section.title}
                                    </h2>
                                )}
                                
                                {section.documents.length > 0 ? (
                                    <div className="space-y-3">
                                        {section.documents.map((doc, index) => (
                                            <a
                                                key={index}
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-start space-x-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                                            >
                                                <FileText className="w-5 h-5 text-primary group-hover:text-primary-hover transition-colors flex-shrink-0 mt-0.5" />
                                                <span className="text-foreground font-medium group-hover:text-primary transition-colors leading-relaxed">
                                                    {doc.title}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    !('internalLink' in section) && (
                                        <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-6 text-center">
                                            <p className="text-muted-foreground">Документы будут добавлены позже</p>
                                        </div>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Documents;

