<?php

function partition_first(array &$A, int $l, int $r): int
{
    $pivot = $A[$l];
    $i = $l + 1;
    for ($j = $i; $j <= $r; $j++) {
        if ($A[$j] < $pivot) {
            list($A[$i], $A[$j]) = [$A[$j], $A[$i]];
            $i++;
        }
    }
    list($A[$i - 1], $A[$l]) = [$A[$l], $A[$i - 1]];
    return $i - 1;
}

function partition_last(array &$A, int $l, int $r): int
{
    list($A[$l], $A[$r]) = [$A[$r], $A[$l]];
    return partition_first($A, $l, $r);
}

function median(array &$A, int $l, int $r)
{
    if ($r - $l + 1 < 3) {
        return;
    }
    $mid = $l + intval(($r - $l) / 2);
    $max = max($A[$l], $A[$r], $A[$mid]);
    $min = min($A[$l], $A[$r], $A[$mid]);
    if ($A[$mid] > $min && $A[$mid] < $max) {
        list($A[$l], $A[$mid]) = [$A[$mid], $A[$l]];
    } elseif ($A[$r] > $min && $A[$r] < $max) {
        list($A[$l], $A[$r]) = [$A[$r], $A[$l]];
    }
}

function partition_median(array &$A, int $l, int $r): int
{
    median($A, $l, $r);
    return partition_first($A, $l, $r);
}

function quick_sort(string $partition = 'partition_first'): Closure
{
    $quick_sort = function (array &$A, int $l, int $r) use ($partition, &$quick_sort): int {
        if ($r <= $l) {
            return 0;
        }
        $partition_index = $partition($A, $l, $r);
        $comparisons = $r - $l;
        $comparisons += $quick_sort($A, $l, $partition_index - 1);
        $comparisons += $quick_sort($A, $partition_index + 1, $r);
        return $comparisons;
    };
    return $quick_sort;
}

foreach (['partition_first', 'partition_last', 'partition_median'] as $partition) {
    $array = file('./QuickSort.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    echo quick_sort($partition)($array, 0, count($array) - 1) . PHP_EOL;
}
