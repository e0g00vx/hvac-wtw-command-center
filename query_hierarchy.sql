SELECT DISTINCT 
  sr_director, 
  fm_director, 
  fm_regional_mgr, 
  COUNT(DISTINCT store_nbr) as stores 
FROM `wmt-fm-engg-prod.HVAC_REPORTING.store_hierarchy` 
WHERE sr_director = 'B.A. GLASS' 
GROUP BY 1,2,3 
ORDER BY 2,3
