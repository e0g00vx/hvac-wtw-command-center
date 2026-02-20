SELECT DISTINCT 
  bu_director,
  COUNT(DISTINCT store_nbr) as stores
FROM `wmt-fm-engg-prod.HVAC_REPORTING.store_hierarchy` 
GROUP BY 1
ORDER BY 2 DESC
LIMIT 20
