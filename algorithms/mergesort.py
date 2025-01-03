def merge_sort(arr):
    # Liste hat nur ein ELemet=> Liste sortiert
    if len(arr) <= 1:
        return arr
    
    
    mid = len(arr) // 2
    linke_haelfte = arr[:mid]
    rechte_haelfte = arr[mid:]
    
    # Rekursiv die beiden Hälften sortieren
    links_sortiert = merge_sort(linke_haelfte)
    rechts_sortiert= merge_sort(rechte_haelfte)
    
    # Zusammenführen der beiden sortierten Hälften
    return merge(links_sortiert, rechts_sortiert)

def merge(links, rechts):
    # Ergebnis-Array für die zusammengeführten Werte
    merged = []
    i = j = 0
    
    # Solange beide Listen noch Elemente haben, vergleiche sie
    while i < len(links) and j < len(rechts):
        if links[i] < rechts[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(rechts[j])
            j += 1
    
    # Füge die restlichen Elemente der nicht-leeren Liste hinzu
    merged.extend(links[i:])
    merged.extend(rechts[j:])
    
    return merged
